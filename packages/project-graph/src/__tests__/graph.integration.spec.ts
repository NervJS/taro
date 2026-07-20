import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createProjectGraph } from '../graph'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

/** 把 fixture 拷到临时目录，避免 .taro 缓存写回污染源码树。 */
function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-it-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  return tmp
}

describe('createProjectGraph — 整图与查询 API', () => {
  let root: string

  beforeEach(() => {
    root = copyFixture()
  })
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  test('整图：schemaVersion / framework / 页面数正确', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.schemaVersion).toBe('1.0.0')
    expect(g.framework).toBe('react')
    expect(g.pages.map((p) => p.id).sort()).toEqual(['pages/detail/index', 'pages/index/index'])
    // 未注入 kernel → 插件与 platforms 空
    expect(g.plugins).toEqual([])
    expect(g.platforms).toEqual([])
  })

  test('页面节点带 config（index 有 index.config.ts）', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    const index = g.pages.find((p) => p.id === 'pages/index/index')!
    expect(index.framework).toBe('react')
    expect(index.config.navigationBarTitleText).toBe('首页')
  })

  test('navigation 边：命中的 resolved:true，悬空的 resolved:false + broken_navigation 告警', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    const toDetail = g.edges.find((e) => e.to === 'pages/detail/index')!
    expect(toDetail.resolved).toBe(true)
    const toGhost = g.edges.find((e) => e.to === 'pages/ghost/index')!
    expect(toGhost.resolved).toBe(false)
    expect(g.warnings.some((w) => w.kind === 'broken_navigation')).toBe(true)
  })

  test('findPageByRoute：按路由查页面', () => {
    const q = createProjectGraph({ root })
    expect(q.findPageByRoute('/pages/detail/index')?.id).toBe('pages/detail/index')
    expect(q.findPageByRoute('pages/detail/index')?.id).toBe('pages/detail/index')
    expect(q.findPageByRoute('/pages/nope/index')).toBeUndefined()
  })

  test('findPageByFilePath：按文件路径查页面', () => {
    const q = createProjectGraph({ root })
    const detail = q.findPageByRoute('pages/detail/index')!
    expect(q.findPageByFilePath(detail.filePath)?.id).toBe('pages/detail/index')
  })

  test('findReferencesToPage：反查跳转到某页的边', () => {
    const q = createProjectGraph({ root })
    const refs = q.findReferencesToPage('pages/detail/index')
    expect(refs).toHaveLength(1)
    expect(refs[0].from).toBe('pages/index/index')
  })

  test('未注入 kernel：getPlugins/getPlatforms 空、不报错', () => {
    const q = createProjectGraph({ root })
    expect(q.getPlugins()).toEqual([])
    expect(q.getPlatforms()).toEqual([])
    expect(q.findPluginById('anything')).toBeUndefined()
  })

  test('声明了路由但无一解析到文件 → 零页面兜底 warning（5b 诊断）', () => {
    // app.config 声明页面，但对应文件不存在（模拟 sourceRoot 错/未注入别名）。
    // 应产出顶层 config_parse_failed 告警提示，而非静默空图。
    const bad = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-zero-'))
    fs.mkdirSync(path.join(bad, 'src'), { recursive: true })
    fs.writeFileSync(path.join(bad, 'src/app.config.ts'), "export default { pages: ['pages/ghost/index'] }\n")
    try {
      const g = createProjectGraph({ root: bad }).getProjectGraph()
      expect(g.pages).toEqual([])
      const w = g.warnings.find((w) => w.message.includes('无一解析到文件'))
      expect(w).toBeDefined()
      expect(w!.kind).toBe('config_parse_failed')
    } finally {
      fs.rmSync(bad, { recursive: true, force: true })
    }
  })
})
