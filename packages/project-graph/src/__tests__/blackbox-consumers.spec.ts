/**
 * @tarojs/project-graph — 四类黑盒消费者接入证明（WP9b / §7 独立性与接入性验证）
 *
 * 计划 §7 硬约束：**黑盒测试只能从包公共入口导入**（此处即 '../index'：createProjectGraph
 * + query 契约 + schema 类型），**不得**访问 parser / resolver / cache / scc 或二次扫描源码。
 * 若某消费者拿不到所需事实，是 P2 的缺陷（应修核心），而非在测试里绕内部。
 *
 * 覆盖 §7 / §9「黑盒接入」行要求的四类消费者：
 *   1. 文件级依赖投影   —— 从 filePath 出发投影其组件依赖（IDE「这个文件依赖谁」）。
 *   2. mock capability catalog 关联 —— 用 getGraphSummary().capabilities 做能力目录，
 *      与节点 analysisStatus 一致性（消费方据此决定「哪些分析可信」）。
 *   3. Language Tools 风格 —— config/JSX 引用的位置定位（findComponentReferenceAt）
 *      + unresolved 批量查询（listComponentReferences，红线/诊断）。
 *   4. B39 组件依赖图    —— 仅经 findComponentDependencies(direct+transitive) 与
 *      graph.issues(kind:'cycle', 承接 SCC) 即可投影组件树 / 依赖边 / 环，零内部读取。
 */

import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

// 仅从公共入口导入——本行是 §7 约束的物理体现：整个文件不 import 任何 ../parser|resolver|cache|scc。
import { createProjectGraph } from '../index'

import type { IComponentEdgeBase, IEdge, IProjectGraphQuery } from '../index'

/** 组件边窄化：从 IEdge 联合里滤掉 navigation，取到带 resolution/rawSpecifier 的组件边。 */
function isComponentEdge(e: IEdge): e is IEdge & IComponentEdgeBase {
  return e.kind === 'usingComponent' || e.kind === 'componentUsage'
}

/**
 * 造一个「富」工程：local 组件链 Card→Sub（供文件投影 + B39 树）、npm(vant)、
 * unresolved(拼错路径)、以及 A↔B 组件环（供 B39 cycle 投影）。
 */
function buildRichProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-blackbox-'))
  fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
  fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'rich', devDependencies: { '@tarojs/plugin-framework-react': '*' } }),
  )
  // npm 包 vant（真实可解析终点）
  const vant = path.join(root, 'node_modules/vant')
  fs.mkdirSync(vant, { recursive: true })
  fs.writeFileSync(path.join(vant, 'package.json'), JSON.stringify({ name: 'vant', version: '1.0.0', main: 'index.js' }))
  fs.writeFileSync(path.join(vant, 'index.js'), 'module.exports={}')
  // local 组件链：Card 依赖 Sub（config usingComponents）
  fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
  fs.writeFileSync(
    path.join(root, 'src/components/Card.config.ts'),
    "export default { usingComponents: { Sub: './Sub' } }\n",
  )
  fs.writeFileSync(path.join(root, 'src/components/Sub.tsx'), 'export default function Sub(){ return null }\n')
  // 组件环 A↔B（各自 config 互相声明 → SCC）
  fs.writeFileSync(path.join(root, 'src/components/A.tsx'), 'export default function A(){ return null }\n')
  fs.writeFileSync(path.join(root, 'src/components/A.config.ts'), "export default { usingComponents: { B: './B' } }\n")
  fs.writeFileSync(path.join(root, 'src/components/B.tsx'), 'export default function B(){ return null }\n')
  fs.writeFileSync(path.join(root, 'src/components/B.config.ts'), "export default { usingComponents: { A: './A' } }\n")
  // app.config
  fs.writeFileSync(path.join(root, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
  // page config：Card(local) + Btn(npm vant) + Ghost(unresolved 拼错) + A(拉入环)
  fs.writeFileSync(
    path.join(root, 'src/pages/index/index.config.ts'),
    "export default {\n  usingComponents: {\n    Card: '../../components/Card',\n    Btn: 'vant',\n    Ghost: '../../components/Nope',\n    A: '../../components/A',\n  },\n}\n",
  )
  // page JSX：使用 Card（componentUsage）
  fs.writeFileSync(
    path.join(root, 'src/pages/index/index.tsx'),
    "import Card from '../../components/Card'\nexport default function Index(){ return <view><Card /></view> }\n",
  )
  return root
}

describe('§7 四类黑盒消费者（仅公共入口 ../index）', () => {
  let root: string
  let query: IProjectGraphQuery
  beforeEach(() => {
    root = buildRichProject()
    query = createProjectGraph({ root })
  })
  afterEach(() => {
    query.dispose()
    fs.rmSync(root, { recursive: true, force: true })
  })

  test('消费者①文件级依赖投影：由页面文件路径反查节点，再投影其直接组件依赖（IDE「此文件依赖谁」）', () => {
    const graph = query.getProjectGraph()
    const indexPage = graph.pages.find((p) => p.id === 'pages/index/index')!
    expect(typeof indexPage.filePath).toBe('string')

    // 文件级投影入口：从**文件路径**反查页面节点（IDE 只握有当前文件路径）。
    const byFile = query.findPageByFilePath(indexPage.filePath)
    expect(byFile?.id).toBe(indexPage.id)

    // 再投影该页面 config 声明的直接组件依赖边（app/page/component config 通用入口）。
    // findUsingComponents 恒返回组件边（usingComponent），窄化掉 navigation 以取 resolution。
    const deps = query.findUsingComponents({ pageId: indexPage.id }).filter(isComponentEdge)
    expect(deps.length).toBeGreaterThan(0)
    // 依赖含 local(Card) 命中 + 混合终态：至少一条 npm、一条 unresolved（如实反映而非过滤）。
    expect(deps.some((e) => e.rawSpecifier.includes('Card'))).toBe(true)
    const resolutions = new Set(deps.map((e) => e.resolution))
    expect(resolutions.has('npm')).toBe(true)
    expect(resolutions.has('unresolved')).toBe(true)
  })

  test('消费者②mock capability catalog：capabilities 与节点 analysisStatus 一致（能力目录关联）', () => {
    const summary = query.getGraphSummary()
    // 消费方把 capabilities 当「能力目录」：每个 analyzer 有明确 status（判别联合）。
    const caps = summary.capabilities
    expect(caps.configAnalyzer.status).toMatch(/^(supported|degraded|unsupported)$/)
    expect(caps.jsxAnalyzer.status).toMatch(/^(supported|degraded|unsupported)$/)

    // 一致性不变式（§3.4，仅 supported/degraded 那套）：degraded ⇔ 存在非 complete 的节点。
    const graph = query.getProjectGraph()
    const allNodes = [graph.app, ...graph.pages, ...graph.components]
    const anyConfigDegraded = allNodes.some((n) => n != null && n.configAnalyzerStatus !== 'complete')
    if (caps.configAnalyzer.status === 'degraded') {
      expect(anyConfigDegraded).toBe(true)
      expect(caps.configAnalyzer).toHaveProperty('failedCount')
    } else if (caps.configAnalyzer.status === 'supported') {
      expect(anyConfigDegraded).toBe(false)
    }
  })

  test('消费者③Language Tools 风格：config 引用位置定位 + unresolved 批量查询（红线/诊断）', () => {
    // 位置定位：拿一条带 sourceSpan 的 config 引用边，用其起点行列反查应命中同一条边。
    const allRefs = query.listComponentReferences().filter(isComponentEdge)
    const spanned = allRefs.find((e) => e.sourceSpan?.startLine != null && e.sourceSpan.startColumn != null)
    expect(spanned).toBeDefined()
    const at = query.findComponentReferenceAt(spanned!.sourceSpan!.filePath, {
      line: spanned!.sourceSpan!.startLine!,
      column: spanned!.sourceSpan!.startColumn!,
    })
    expect(at).toBeDefined()

    // unresolved 批量查询：Language Tools 据此画红线。Ghost(拼错路径)应现身。
    const unresolved = query.listComponentReferences({ resolutions: ['unresolved'] }).filter(isComponentEdge)
    expect(unresolved.length).toBeGreaterThan(0)
    expect(unresolved.every((e) => e.resolution === 'unresolved')).toBe(true)
    expect(unresolved.some((e) => e.rawSpecifier.includes('Nope'))).toBe(true)
  })

  test('消费者④B39 组件依赖图：direct/transitive 投影组件树 + 依赖边 + 环（仅公共产出）', () => {
    // 组件树：从 Card 出发 transitive 应可达 Sub（Card→Sub 链）。
    const cardId = query.getProjectGraph().components.find((c) => c.id.includes('Card'))!.id
    const tree = query.findComponentDependencies({ byId: cardId }, { mode: 'transitive' })
    expect(tree.components.some((c) => c.id.includes('Sub'))).toBe(true)
    // transitive 结果稳定排序、edges 非空（B39 组件树可直接渲染）。
    expect(tree.edges.length).toBeGreaterThan(0)

    // 环：A↔B 经 graph.issues(kind:'cycle') 暴露——B39 可视化「循环依赖」告警的唯一公共来源
    // （SCC 是内部实现，消费方零内部读取即可拿到环成员）。
    const cycles = query.getProjectGraph().issues.filter((i) => i.kind === 'cycle')
    expect(cycles.length).toBeGreaterThan(0)
    // 环 issue 至少覆盖 A、B 两成员之一（message/filePath 承载 SCC 成员线索）。
    const cycleText = JSON.stringify(cycles)
    expect(cycleText.includes('/A') || cycleText.includes('/B') || cycleText.includes('components/A')).toBe(true)
  })
})
