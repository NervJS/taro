import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createProjectGraph } from '../graph'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

/** 把 fixture 拷到临时目录，避免 .taro 缓存写回污染源码树。 */
function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-it-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  fs.cpSync(path.join(FIXTURE, 'package.json'), path.join(tmp, 'package.json'))
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
    expect(g.schemaVersion).toBe('2.0.0')
    expect(g.framework).toBe('react')
    expect(g.pages.map((p) => p.id).sort()).toEqual(['pages/detail/index', 'pages/index/index'])
    // 未注入 kernel → 插件与 platforms 空
    expect(g.plugins).toEqual([])
    expect(g.platforms).toEqual([])
  })

  test('WP7b：首次构建 revision=1、snapshotId 非空（§6 生命周期）', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.revision).toBe(1)
    expect(typeof g.snapshotId).toBe('string')
    expect(g.snapshotId.length).toBeGreaterThan(0)
  })

  test('WP5b：framework 六值判定——顶层与逐页 PageNode.framework 严格一致（单 context）', () => {
    // mini-app fixture 带 package.json（含 @tarojs/plugin-framework-react）→ react。
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.framework).toBe('react')
    // 单项目单 AnalysisContext：每页 framework 都等于顶层（§3.2）。
    for (const p of g.pages) {
      expect(p.framework).toBe(g.framework)
    }
    // analysisContext 记录同值 + 来源（package.json 静态推断）。
    expect(g.analysisContext.framework).toBe('react')
    expect(g.analysisContext.frameworkSource).toBe('static-config')
  })

  test('页面节点带 config（index 有 index.config.ts）', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    const index = g.pages.find((p) => p.id === 'pages/index/index')!
    expect(index.framework).toBe('react')
    expect(index.config.navigationBarTitleText).toBe('首页')
  })

  test('navigation 边：命中的 resolved:true，悬空的 resolved:false（不再单独产 issue）', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    const navEdges = g.edges.filter((e) => e.kind === 'navigation')
    const toDetail = navEdges.find((e) => e.to === 'pages/detail/index')!
    expect(toDetail.resolved).toBe(true)
    const toGhost = navEdges.find((e) => e.to === 'pages/ghost/index')!
    expect(toGhost.resolved).toBe(false)
    // Schema 2.0：悬空跳转语义由 edge.resolved=false 承接，不再产 broken_navigation issue。
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

  test('声明了路由但无一解析到文件 → 零页面兜底 issue（5b 诊断）', () => {
    // app.config 声明页面，但对应文件不存在（模拟 sourceRoot 错/未注入别名）。
    // 应产出顶层 parse-failed issue 提示，而非静默空图。
    const bad = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-zero-'))
    fs.mkdirSync(path.join(bad, 'src'), { recursive: true })
    fs.writeFileSync(path.join(bad, 'src/app.config.ts'), "export default { pages: ['pages/ghost/index'] }\n")
    try {
      const g = createProjectGraph({ root: bad }).getProjectGraph()
      expect(g.pages).toEqual([])
      const issue = g.issues.find((i) => i.message.includes('无一解析到文件'))
      expect(issue).toBeDefined()
      expect(issue!.kind).toBe('parse-failed')
    } finally {
      fs.rmSync(bad, { recursive: true, force: true })
    }
  })

  // ---- WP4：config 组件图接入（components 填充 + usingComponent 边）----------

  test('page config 声明 local 组件 → 图产出 ComponentNode 与 usingComponent 边', () => {
    // 给 index 页面加 config 声明一个 local 组件。
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.config.ts'),
      "export default {\n  navigationBarTitleText: '首页',\n  usingComponents: {\n    Card: '../../components/Card',\n  },\n}\n",
    )
    const g = createProjectGraph({ root }).getProjectGraph()
    // 组件节点
    const cardNode = g.components.find((c) => c.sourceKind === 'local' && c.resolvedFilePath?.endsWith('Card.tsx'))
    expect(cardNode).toBeDefined()
    // usingComponent 边：from=页面 id，指向组件节点
    const edge = g.edges.find((e) => e.kind === 'usingComponent' && e.localName === 'Card')
    expect(edge).toBeDefined()
    expect(edge).toMatchObject({ kind: 'usingComponent', from: 'pages/index/index', resolution: 'local' })
    expect((edge as { to?: string }).to).toBe(cardNode!.id)
    // 精确 span（config 是真实字面量文件）
    expect((edge as { sourceSpan?: { startLine?: number } }).sourceSpan?.startLine).toBeGreaterThan(0)
  })

  test('未声明任何组件的项目 → components 为空、无 usingComponent 边（不误产）', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.components).toEqual([])
    expect(g.edges.some((e) => e.kind === 'usingComponent')).toBe(false)
  })

  test('app.config usingComponents → app 级全局组件（from=app）', () => {
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Global.tsx'), 'export default function G(){ return null }\n')
    const appCfg = path.join(root, 'src/app.config.ts')
    const orig = fs.readFileSync(appCfg, 'utf8')
    fs.writeFileSync(appCfg, orig.replace(/export default \{/, "export default {\n  usingComponents: { Global: './components/Global' },"))
    const g = createProjectGraph({ root }).getProjectGraph()
    const edge = g.edges.find((e) => e.kind === 'usingComponent' && e.localName === 'Global')
    expect(edge).toBeDefined()
    expect(edge!.from).toBe('app')
  })

  // ---- WP5b.2：capabilities framework×analyzer 静态表 -----------------------

  test('react 工程：jsxAnalyzer 参与聚合(supported)，templateAnalyzer not-applicable', () => {
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.framework).toBe('react')
    expect(g.capabilities.configAnalyzer.status).toBe('supported')
    expect(g.capabilities.jsxAnalyzer.status).toBe('supported')
    expect(g.capabilities.templateAnalyzer).toEqual({ status: 'unsupported', reason: 'not-applicable' })
  })

  test('vue3 工程（kernel 注入）：jsx 与 template 均 deferred，config 仍聚合', () => {
    const g = createProjectGraph({ root, kernel: { initialConfig: { framework: 'vue3' } } }).getProjectGraph()
    expect(g.framework).toBe('vue3')
    expect(g.capabilities.configAnalyzer.status).toBe('supported')
    expect(g.capabilities.jsxAnalyzer).toEqual({ status: 'unsupported', reason: 'deferred' })
    expect(g.capabilities.templateAnalyzer).toEqual({ status: 'unsupported', reason: 'deferred' })
  })

  test('none 工程（kernel 注入）：jsx 与 template 均 not-applicable', () => {
    const g = createProjectGraph({ root, kernel: { initialConfig: { framework: 'none' } } }).getProjectGraph()
    expect(g.framework).toBe('none')
    expect(g.capabilities.jsxAnalyzer).toEqual({ status: 'unsupported', reason: 'not-applicable' })
    expect(g.capabilities.templateAnalyzer).toEqual({ status: 'unsupported', reason: 'not-applicable' })
  })

  test('Vue3 config-only：不产 componentUsage(JSX) 边，config usingComponent 边仍可建', () => {
    // Vue3 承诺项：只做 config-only，不采 JSX render function → 无 componentUsage 边。
    // 注：本 fixture 页面用 TSX，但 framework=vue3 下 JSX 通道不参与（WP5c 接入时门控）。
    const g = createProjectGraph({ root, kernel: { initialConfig: { framework: 'vue3' } } }).getProjectGraph()
    expect(g.framework).toBe('vue3')
    // config 通道与 framework 无关，usingComponent 边照常（此 fixture 默认无声明，空亦可）。
    expect(g.edges.every((e) => e.kind !== 'componentUsage')).toBe(true)
  })

  // ---- WP5a/WP5c：JSX componentUsage 边接入 + barrel 穿透（集成）------------

  test('页面 JSX 用 local 组件 → componentUsage 边 + ComponentNode', () => {
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
    // 改 index 页面：import 组件并当 JSX 标签用
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.tsx'),
      `import Card from '../../components/Card'\nexport default function Index(){ return <view><Card /></view> }\n`,
    )
    const g = createProjectGraph({ root }).getProjectGraph()
    const usage = g.edges.find((e) => e.kind === 'componentUsage' && e.localName === 'Card')
    expect(usage).toBeDefined()
    expect(usage).toMatchObject({ from: 'pages/index/index', resolution: 'local' })
    expect(g.components.some((c) => c.resolvedFilePath?.endsWith('Card.tsx'))).toBe(true)
  })

  test('WP5c：JSX 经 barrel 穿透到最终定义（deep chain, cycle-safe 不崩）', () => {
    fs.mkdirSync(path.join(root, 'src/ui'), { recursive: true })
    // barrel: ui/index.ts → ui/mid.ts → ui/Button.tsx（深链）
    fs.writeFileSync(path.join(root, 'src/ui/index.ts'), `export { Button } from './mid'\n`)
    fs.writeFileSync(path.join(root, 'src/ui/mid.ts'), `export { Button } from './Button'\n`)
    fs.writeFileSync(path.join(root, 'src/ui/Button.tsx'), 'export function Button(){ return null }\n')
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.tsx'),
      `import { Button } from '../../ui'\nexport default function Index(){ return <view><Button /></view> }\n`,
    )
    const g = createProjectGraph({ root }).getProjectGraph()
    const usage = g.edges.find((e) => e.kind === 'componentUsage' && e.localName === 'Button')
    expect(usage).toBeDefined()
    expect(usage!.resolution).toBe('local')
    // 身份穿透到最终定义 Button.tsx，而非停在 barrel index.ts
    expect(usage!.to).toContain('Button.tsx')
    expect(usage!.rawSpecifier).toBe('../../ui') // 保留最初引用点
  })

  test('WP5c：JSX 组件互引用（A↔B）不死循环、图正常产出', () => {
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/A.tsx'), `import B from './B'\nexport default function A(){ return <B /> }\n`)
    fs.writeFileSync(path.join(root, 'src/components/B.tsx'), `import A from './A'\nexport default function B(){ return <A /> }\n`)
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.tsx'),
      `import A from '../../components/A'\nexport default function Index(){ return <A /> }\n`,
    )
    expect(() => createProjectGraph({ root }).getProjectGraph()).not.toThrow()
    const g = createProjectGraph({ root }).getProjectGraph()
    // A、B 各建一次节点（去重），互引用不无限展开
    expect(g.components.filter((c) => c.resolvedFilePath?.endsWith('A.tsx') || c.resolvedFilePath?.endsWith('B.tsx'))).toHaveLength(2)
  })

  test('同一组件被 config 声明又被 JSX 使用 → 去重为一个节点（config 优先，带 config 浅读）', () => {
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Dual.tsx'), 'export default function Dual(){ return null }\n')
    // 组件带 config 文件（config 通道节点会浅读它，JSX 通道节点不会）
    fs.writeFileSync(path.join(root, 'src/components/Dual.config.ts'), `export default { navigationBarTitleText: 'dual' }\n`)
    // page config 声明 + page JSX 使用，指向同一组件
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.config.ts'),
      "export default {\n  usingComponents: { Dual: '../../components/Dual' },\n}\n",
    )
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.tsx'),
      `import Dual from '../../components/Dual'\nexport default function Index(){ return <view><Dual /></view> }\n`,
    )
    const g = createProjectGraph({ root }).getProjectGraph()
    const dualNodes = g.components.filter((c) => c.resolvedFilePath?.endsWith('Dual.tsx'))
    expect(dualNodes).toHaveLength(1) // 去重为一个节点
    // config 通道节点优先保留 → 带 configFilePath 浅读字段
    expect(dualNodes[0].configFilePath?.endsWith('Dual.config.ts')).toBe(true)
    // 两条独立事实边都在（usingComponent + componentUsage），不相互覆盖
    expect(g.edges.some((e) => e.kind === 'usingComponent' && e.localName === 'Dual')).toBe(true)
    expect(g.edges.some((e) => e.kind === 'componentUsage' && e.localName === 'Dual')).toBe(true)
  })

  test('unknown framework（无 kernel 且无 package.json）：jsx/template 均 not-applicable', () => {
    // 独立 root 无 package.json → framework 降级 unknown。
    const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-unknown-'))
    fs.mkdirSync(path.join(bare, 'src'), { recursive: true })
    fs.writeFileSync(path.join(bare, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
    fs.mkdirSync(path.join(bare, 'src/pages/index'), { recursive: true })
    fs.writeFileSync(path.join(bare, 'src/pages/index/index.tsx'), 'export default function I(){ return <view/> }\n')
    try {
      const g = createProjectGraph({ root: bare }).getProjectGraph()
      expect(g.framework).toBe('unknown')
      expect(g.capabilities.jsxAnalyzer).toEqual({ status: 'unsupported', reason: 'not-applicable' })
      expect(g.capabilities.templateAnalyzer).toEqual({ status: 'unsupported', reason: 'not-applicable' })
      // unknown 不参与 JSX 通道 → 无 componentUsage 边
      expect(g.edges.every((e) => e.kind !== 'componentUsage')).toBe(true)
    } finally {
      fs.rmSync(bare, { recursive: true, force: true })
    }
  })

  // ---- WP6b：SCC cycle issue + analysis-incomplete 一致性不变式（集成）--------

  test('组件循环依赖 → cycle IGraphIssue（sccMembers 稳定序）', () => {
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    // A config 声明 B，B config 声明 A → 环
    fs.writeFileSync(path.join(root, 'src/components/A.tsx'), 'export default function A(){ return null }\n')
    fs.writeFileSync(path.join(root, 'src/components/A.config.ts'), `export default { usingComponents: { B: './B' } }\n`)
    fs.writeFileSync(path.join(root, 'src/components/B.tsx'), 'export default function B(){ return null }\n')
    fs.writeFileSync(path.join(root, 'src/components/B.config.ts'), `export default { usingComponents: { A: './A' } }\n`)
    // 页面引用 A
    fs.writeFileSync(path.join(root, 'src/pages/index/index.config.ts'), "export default { usingComponents: { A: '../../components/A' } }\n")
    const g = createProjectGraph({ root }).getProjectGraph()
    const cycle = g.issues.find((i) => i.kind === 'cycle')
    expect(cycle).toBeDefined()
    expect(cycle!.sccMembers).toBeDefined()
    expect(cycle!.sccMembers!.length).toBe(2)
    // 成员是 A、B 的组件 id，稳定字典序
    expect([...cycle!.sccMembers!].sort()).toEqual(cycle!.sccMembers)
  })

  test('存在 partial 节点 → 恰产一条 analysis-incomplete issue（图级汇总非每节点）', () => {
    // 两个页面都用后缀-only 组件（无 platform → jsxAnalyzer/config partial）
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Only.weapp.tsx'), 'export default function O(){ return null }\n')
    fs.writeFileSync(path.join(root, 'src/pages/index/index.config.ts'), "export default { usingComponents: { Only: '../../components/Only' } }\n")
    fs.writeFileSync(path.join(root, 'src/pages/detail/index.config.ts'), "export default { usingComponents: { Only: '../../components/Only' } }\n")
    const g = createProjectGraph({ root }).getProjectGraph()
    const incompletes = g.issues.filter((i) => i.kind === 'analysis-incomplete')
    // 图级汇总：即便多个节点 partial，也只产一条
    expect(incompletes).toHaveLength(1)
    // 一致性：capabilities 对应 analyzer 应为 degraded（同源派生）
    expect(g.capabilities.configAnalyzer.status === 'degraded' || g.capabilities.jsxAnalyzer.status === 'degraded').toBe(true)
  })

  test('全 complete 工程 → 无 analysis-incomplete issue', () => {
    // 默认 mini-app fixture 无 partial/failed 节点
    const g = createProjectGraph({ root }).getProjectGraph()
    expect(g.issues.some((i) => i.kind === 'analysis-incomplete')).toBe(false)
  })
})
