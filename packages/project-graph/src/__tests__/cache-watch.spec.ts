import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { buildSeed, computeContentHash, readCache } from '../cache'
import { createProjectGraph } from '../graph'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-cache-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  return tmp
}

const cachePath = (root: string) => path.join(root, '.taro', 'graph.cache.json')

describe('computeContentHash / buildSeed', () => {
  test('seed 随 sourceRoot / alias 变化', () => {
    expect(buildSeed('/a/src', {})).not.toBe(buildSeed('/a/client', {}))
    expect(buildSeed('/a/src', {})).not.toBe(buildSeed('/a/src', { '@': '/x' }))
  })
  test('alias key 顺序无关（稳定序列化）', () => {
    expect(buildSeed('/a', { x: 1, y: 2 })).toBe(buildSeed('/a', { y: 2, x: 1 }))
  })
  test('空文件集 + 不同 seed → 不同 hash（防空图误命中）', () => {
    expect(computeContentHash([], buildSeed('/a/src', {}))).not.toBe(
      computeContentHash([], buildSeed('/a/client', {})),
    )
  })
})

describe('持久化缓存', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('首次构建写缓存文件', () => {
    createProjectGraph({ root })
    expect(fs.existsSync(cachePath(root))).toBe(true)
    const cached = readCache(root)!
    expect(cached.schemaVersion).toBe('1.0.0')
  })

  test('重启（源文件未变）命中缓存：跳过冷启动（不重写缓存文件）', async () => {
    // 命中路径直接复用缓存、不 writeCache；miss（重建）才 writeCache。
    // 故用缓存文件 mtime 是否变化区分「真命中」与「重建」——即便重建产物 contentHash
    // 相同，写文件也会刷新 mtime，能捕捉「本该命中却冷启动」的回归。
    createProjectGraph({ root }) // 冷启动，写缓存
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20)) // 确保 mtime 分辨率足够区分
    createProjectGraph({ root }) // 第二次应命中，不重写
    const mtimeAfter = fs.statSync(cachePath(root)).mtimeMs
    expect(mtimeAfter).toBe(mtimeBefore)
  })

  test('schemaVersion 不匹配 → readCache 返回 undefined（触发重建）', () => {
    createProjectGraph({ root })
    const cached = JSON.parse(fs.readFileSync(cachePath(root), 'utf8'))
    cached.schemaVersion = '0.0.0-old'
    fs.writeFileSync(cachePath(root), JSON.stringify(cached))
    expect(readCache(root)).toBeUndefined()
  })

  test('损坏缓存（残缺 graph）→ readCache 降级 undefined，不抛', () => {
    createProjectGraph({ root })
    fs.writeFileSync(cachePath(root), JSON.stringify({ schemaVersion: '1.0.0', contentHash: 'x', graph: {} }))
    expect(() => readCache(root)).not.toThrow()
    expect(readCache(root)).toBeUndefined()
  })

  test('仅改页面文件 body（不动 app.config）→ content hash 变、缓存失效重建', async () => {
    // 页面文件内容也在 collectInputFiles 里（含 page.filePath）。只改某页 body、
    // 不动 app.config，缓存也应失效——否则页面内容变更（如新增跳转）会被旧图掩盖。
    // 用缓存文件 mtime 变化证明发生了重建（miss→writeCache），而非命中。
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    // 改 detail 页面 body（不改 app.config、不增减页面）
    const detail = path.join(root, 'src/pages/detail/index.tsx')
    fs.writeFileSync(detail, 'export default function Detail(){ return <view>changed</view> }\n')
    createProjectGraph({ root })
    const mtimeAfter = fs.statSync(cachePath(root)).mtimeMs
    expect(mtimeAfter).not.toBe(mtimeBefore) // 重写过 → 确实 miss 重建
  })

  test('app.config 变更 → 页面集刷新（缓存失效重建）', () => {
    createProjectGraph({ root })
    // 新增页面文件 + 注册进 pages
    fs.mkdirSync(path.join(root, 'src/pages/extra'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/pages/extra/index.tsx'), 'export default function E(){ return <view/> }\n')
    const appConfig = path.join(root, 'src/app.config.ts')
    const orig = fs.readFileSync(appConfig, 'utf8')
    fs.writeFileSync(appConfig, orig.replace(/pages:\s*\[/, "pages: [\n    'pages/extra/index',"))
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.pages.map((p) => p.id)).toContain('pages/extra/index')
  })
})

