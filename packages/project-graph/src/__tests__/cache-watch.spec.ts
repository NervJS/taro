import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { buildFingerprint, collectPackageInputs, computeManifestHash, readCache } from '../cache'
import { createProjectGraph } from '../graph'

import type { IInputManifest } from '../cache'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-cache-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  fs.cpSync(path.join(FIXTURE, 'package.json'), path.join(tmp, 'package.json'))
  return tmp
}

const cachePath = (root: string) => path.join(root, '.taro', 'graph.cache.json')

describe('buildFingerprint / computeManifestHash（§6 InputManifest）', () => {
  const fp = (over: Partial<Parameters<typeof buildFingerprint>[0]> = {}) =>
    buildFingerprint({ sourceRoot: '/a/src', framework: 'react', platform: undefined, alias: {}, ...over })

  test('fingerprint 随 sourceRoot / framework / platform / alias 变化', () => {
    expect(fp()).not.toBe(fp({ sourceRoot: '/a/client' }))
    expect(fp()).not.toBe(fp({ framework: 'vue3' }))
    expect(fp()).not.toBe(fp({ platform: 'weapp' }))
    expect(fp()).not.toBe(fp({ alias: { '@': '/x' } }))
  })
  test('alias key 顺序无关（稳定序列化）', () => {
    expect(fp({ alias: { x: 1, y: 2 } })).toBe(fp({ alias: { y: 2, x: 1 } }))
  })

  // 用一个只含 fingerprint、无文件的 manifest 验证哈希语义（不读盘）。
  const bare = (over: Partial<IInputManifest> = {}): IInputManifest => ({
    readFiles: [], missingCandidates: [], packageInputs: [], fingerprint: fp(), ...over,
  })

  test('空文件集 + 不同 fingerprint → 不同 hash（防空图误命中）', () => {
    expect(computeManifestHash(bare({ fingerprint: fp() }))).not.toBe(
      computeManifestHash(bare({ fingerprint: fp({ sourceRoot: '/a/client' }) })),
    )
  })

  test('readFiles 顺序无关、去重（稳定摘要）', () => {
    const a = computeManifestHash(bare({ readFiles: ['/x/a.ts', '/x/b.ts'] }))
    const b = computeManifestHash(bare({ readFiles: ['/x/b.ts', '/x/a.ts', '/x/a.ts'] }))
    expect(a).toBe(b)
  })

  test('同路径在 readFiles vs missingCandidates 类别不同 → hash 不同（语义迁移可辨）', () => {
    const asRead = computeManifestHash(bare({ readFiles: ['/x/Ghost.tsx'] }))
    const asMissing = computeManifestHash(bare({ missingCandidates: ['/x/Ghost.tsx'] }))
    expect(asRead).not.toBe(asMissing)
  })

  test('缺失候选文件从「不存在」变「存在有内容」→ hash 变（补文件失效核心）', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-mc-'))
    try {
      const ghost = path.join(dir, 'Ghost.tsx')
      const before = computeManifestHash(bare({ missingCandidates: [ghost] }))
      fs.writeFileSync(ghost, 'export default function G(){ return null }\n')
      const after = computeManifestHash(bare({ missingCandidates: [ghost] }))
      expect(after).not.toBe(before)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('collectPackageInputs', () => {
  test('收 root package.json + 首个存在的 lockfile', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-pkg-'))
    try {
      fs.writeFileSync(path.join(dir, 'package.json'), '{}')
      fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9')
      const inputs = collectPackageInputs(dir)
      expect(inputs).toContain(path.join(dir, 'package.json'))
      expect(inputs).toContain(path.join(dir, 'pnpm-lock.yaml'))
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
  test('无 package.json / lockfile → 空数组（不臆造）', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-nopkg-'))
    try {
      expect(collectPackageInputs(dir)).toEqual([])
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('持久化缓存', () => {
  let root: string
  beforeEach(() => { root = copyFixture() })
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }) })

  test('首次构建写缓存文件（含 manifest）', () => {
    createProjectGraph({ root })
    expect(fs.existsSync(cachePath(root))).toBe(true)
    const cached = readCache(root)!
    expect(cached.schemaVersion).toBe('2.0.0')
    expect(Array.isArray(cached.manifest.readFiles)).toBe(true)
    // app.config 恒在已读文件里
    expect(cached.manifest.readFiles.some((f) => f.endsWith('app.config.ts'))).toBe(true)
  })

  test('重启（源文件未变）命中缓存：跳过冷启动（不重写缓存文件）', async () => {
    createProjectGraph({ root }) // 冷启动，写缓存
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
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

  test('损坏缓存（残缺 graph / manifest）→ readCache 降级 undefined，不抛', () => {
    createProjectGraph({ root })
    fs.writeFileSync(cachePath(root), JSON.stringify({ schemaVersion: '2.0.0', contentHash: 'x', graph: {}, manifest: {} }))
    expect(() => readCache(root)).not.toThrow()
    expect(readCache(root)).toBeUndefined()
  })

  test('仅改页面文件 body（不动 app.config）→ manifest hash 变、缓存失效重建', async () => {
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    const detail = path.join(root, 'src/pages/detail/index.tsx')
    fs.writeFileSync(detail, 'export default function Detail(){ return <view>changed</view> }\n')
    createProjectGraph({ root })
    const mtimeAfter = fs.statSync(cachePath(root)).mtimeMs
    expect(mtimeAfter).not.toBe(mtimeBefore) // 重写过 → 确实 miss 重建
  })

  test('app.config 变更 → 页面集刷新（缓存失效重建）', () => {
    createProjectGraph({ root })
    fs.mkdirSync(path.join(root, 'src/pages/extra'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/pages/extra/index.tsx'), 'export default function E(){ return <view/> }\n')
    const appConfig = path.join(root, 'src/app.config.ts')
    const orig = fs.readFileSync(appConfig, 'utf8')
    fs.writeFileSync(appConfig, orig.replace(/pages:\s*\[/, "pages: [\n    'pages/extra/index',"))
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.pages.map((p) => p.id)).toContain('pages/extra/index')
  })

  // ---- WP7a：P1 缓存三处失效盲区（manifest 修复）----------------------------

  test('补上组件源码文件（unresolved→local）→ 缓存失效、组件节点出现', async () => {
    // 页面 config 声明一个当前不存在的组件 → 首建 unresolved（缺失候选进 manifest）。
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.config.ts'),
      "export default { usingComponents: { Late: '../../components/Late' } }\n",
    )
    const g1 = createProjectGraph({ root }).getProjectGraph()
    expect(g1.components.some((c) => c.resolvedFilePath?.endsWith('Late.tsx'))).toBe(false)
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    // 补上缺失候选文件 → 缓存应失效重建，Late 解析为 local 组件。
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Late.tsx'), 'export default function L(){ return null }\n')
    const g2 = createProjectGraph({ root }).getProjectGraph()
    expect(fs.statSync(cachePath(root)).mtimeMs).not.toBe(mtimeBefore) // miss 重建
    expect(g2.components.some((c) => c.resolvedFilePath?.endsWith('Late.tsx'))).toBe(true)
  })

  test('改组件源码文件（被 config 声明的 local 组件）→ 缓存失效重建', async () => {
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.config.ts'),
      "export default { usingComponents: { Card: '../../components/Card' } }\n",
    )
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    // 改组件源码内容（P1 盲区：组件文件不在 collectInputFiles 里 → 不失效）。
    fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return <view>v2</view> }\n')
    createProjectGraph({ root })
    expect(fs.statSync(cachePath(root)).mtimeMs).not.toBe(mtimeBefore)
  })

  test('root package.json 变更 → 缓存失效重建（装包语义）', async () => {
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    const pkg = path.join(root, 'package.json')
    const parsed = JSON.parse(fs.readFileSync(pkg, 'utf8'))
    parsed.dependencies = { ...parsed.dependencies, 'some-new-pkg': '^1.0.0' }
    fs.writeFileSync(pkg, JSON.stringify(parsed))
    createProjectGraph({ root })
    expect(fs.statSync(cachePath(root)).mtimeMs).not.toBe(mtimeBefore)
  })

  test('无关文件（README 等，非输入）新增 → 不误失效（命中缓存）', async () => {
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    fs.writeFileSync(path.join(root, 'README.md'), '# not an input\n')
    createProjectGraph({ root }) // README 不在 manifest → 应命中、不重写
    expect(fs.statSync(cachePath(root)).mtimeMs).toBe(mtimeBefore)
  })

  // ---- 复核阻断修复回归 -----------------------------------------------------

  test('复核阻断1：context（kernel alias/framework）变更跨重启 → 不误命中', async () => {
    // 首建：无 kernel（framework 来自 package.json=react，alias 空）。
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    // 源文件全未变，只换注入 context：alias 从空变有值。命中判定必须用**当前** fingerprint
    // 重新派生，否则自哈希缓存里那份 fingerprint 会误命中旧图（复核阻断1）。
    createProjectGraph({ root, kernel: { initialConfig: { alias: { '@': path.join(root, 'src') } } } })
    expect(fs.statSync(cachePath(root)).mtimeMs).not.toBe(mtimeBefore) // fingerprint 变 → miss 重建
  })

  test('复核阻断1：framework 变更（kernel 注入 vue3）跨重启 → 不误命中', async () => {
    createProjectGraph({ root })
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    createProjectGraph({ root, kernel: { initialConfig: { framework: 'vue3' } } })
    expect(fs.statSync(cachePath(root)).mtimeMs).not.toBe(mtimeBefore)
  })

  test('复核阻断2：冷启动后新增 page config（原本无）→ 缓存失效', async () => {
    // index 页面默认无 index.config.ts（fixture 里 detail 有、index 无？确保 index 无）。
    const idxCfg = path.join(root, 'src/pages/index/index.config.ts')
    if (fs.existsSync(idxCfg)) fs.rmSync(idxCfg)
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/New.tsx'), 'export default function N(){ return null }\n')
    createProjectGraph({ root }) // 首建：index 无 config，登记 config 缺失候选
    const mtimeBefore = fs.statSync(cachePath(root)).mtimeMs
    await new Promise((resolve) => setTimeout(resolve, 20))
    // 新增 index config（声明组件）→ 补上缺失候选 → 应失效重建、组件边出现。
    fs.writeFileSync(idxCfg, "export default { usingComponents: { New: '../../components/New' } }\n")
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(fs.statSync(cachePath(root)).mtimeMs).not.toBe(mtimeBefore) // miss 重建
    expect(g.edges.some((e) => e.kind === 'usingComponent' && e.localName === 'New')).toBe(true)
  })
})
