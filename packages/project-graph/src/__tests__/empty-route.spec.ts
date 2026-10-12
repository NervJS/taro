/**
 * @tarojs/project-graph — B59 空路由诊断回归（WP9a / §9「空路由诊断」验收行）
 *
 * 契约（计划 §5 + schema.ts:400）：config **声明了 routePath 但对应 PageNode 不存在**
 * 时产 `IGraphIssue { kind: 'empty-route' }`，作**结构化事实**暴露，不产 severity / fix、
 * 不 fail-fast。三个触发源都在生产码里，本 spec 各钉一条：
 *   1. app.config `pages[]` 声明了路由但页面文件缺失      → graph.ts 逐页解析处产出
 *   2. `subPackages[].pages[]` 声明分包路由但页面文件缺失  → 折进 pageRoutes 后同源产出
 *   3. `tabBar.list[].pagePath` 不在 pages 列表内         → config-parser 校验处产出
 *
 * 三条不变式：
 *   (a) 经**公共 API**（getProjectGraph().issues / getGraphSummary().issues）如实暴露；
 *   (b) 经 **CLI --lint** 通道如实暴露且退出码=1（消费方视角）；
 *   (c) **不误报**——合法路由（有对应 PageNode）绝不产 empty-route。
 */

import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { runCli } from '../cli'
import { createProjectGraph } from '../index'

import type { IGraphIssue } from '../schema'

/**
 * 造一个「声明了路由但缺页面文件 / tabBar 指向不存在页面」的最小工程。
 * 只写必要文件：index 页面真实存在（反向对照，不该报），ghost 与 tab 幽灵路由不建文件。
 */
function buildEmptyRouteProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-empty-route-'))
  fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
  // package.json → react（避免 framework=unknown 噪声，不影响 empty-route 事实）
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'empty-route-fixture', devDependencies: { '@tarojs/plugin-framework-react': '*' } }),
  )
  // app.config：pages[] 含存在(index)+幽灵(ghost)；subPackages 含幽灵分包路由(pkgA/pages/lost)；
  // tabBar 指向不在 pages 的路由(phantom)。三触发源各一条。
  fs.writeFileSync(
    path.join(root, 'src/app.config.ts'),
    'export default {\n' +
      "  pages: ['pages/index/index', 'pages/ghost/index'],\n" +
      "  subPackages: [{ root: 'pkgA', pages: ['pages/lost'] }],\n" +
      "  tabBar: { list: [{ pagePath: 'pages/index/index', text: '首页' }, { pagePath: 'pages/phantom/index', text: '幽灵' }] },\n" +
      '}\n',
  )
  // 只有 index 页面真实存在（ghost / pkgA分包 / phantom 均无文件）
  fs.writeFileSync(path.join(root, 'src/pages/index/index.tsx'), 'export default function Index(){ return null }\n')
  return root
}

/** 只有合法路由（每个声明路由都有文件、tabBar 全在 pages 内）的干净工程——反向对照。 */
function buildCleanProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-clean-route-'))
  fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'clean-fixture', devDependencies: { '@tarojs/plugin-framework-react': '*' } }),
  )
  fs.writeFileSync(
    path.join(root, 'src/app.config.ts'),
    'export default {\n' +
      "  pages: ['pages/index/index'],\n" +
      "  tabBar: { list: [{ pagePath: 'pages/index/index', text: '首页' }] },\n" +
      '}\n',
  )
  fs.writeFileSync(path.join(root, 'src/pages/index/index.tsx'), 'export default function Index(){ return null }\n')
  return root
}

const emptyRoutes = (issues: IGraphIssue[]) => issues.filter((i) => i.kind === 'empty-route')

describe('B59 空路由诊断（empty-route GraphIssue）', () => {
  let dirty: string
  let clean: string
  beforeEach(() => {
    dirty = buildEmptyRouteProject()
    clean = buildCleanProject()
  })
  afterEach(() => {
    fs.rmSync(dirty, { recursive: true, force: true })
    fs.rmSync(clean, { recursive: true, force: true })
    process.exitCode = undefined
  })

  test('公共 API：pages[] / subPackages / tabBar 三触发源各产一条 empty-route（routePath 对、无 severity/fix）', () => {
    const graph = createProjectGraph({ root: dirty }).getProjectGraph()
    const ers = emptyRoutes(graph.issues)
    const routePaths = ers.map((i) => i.routePath).sort()

    // 触发源 1：pages[] ghost 无文件；2：subPackages pkgA/pages/lost 无文件（分包路由归一化为 pkgA/pages/lost）；
    // 3：tabBar phantom 不在 pages。三条都应现身。
    expect(routePaths).toEqual(['pages/ghost/index', 'pages/phantom/index', 'pkgA/pages/lost'])
    // 结构化事实：仅暴露分类事实，不带 severity / fix 字段（schema 未定义即不得出现）。
    for (const i of ers) {
      expect((i as Record<string, unknown>).severity).toBeUndefined()
      expect((i as Record<string, unknown>).fix).toBeUndefined()
      expect(typeof i.message).toBe('string')
    }
  })

  test('getGraphSummary().issues 与完整图 issues 同源（轻量通道也暴露 empty-route）', () => {
    const query = createProjectGraph({ root: dirty })
    const summaryIssues = emptyRoutes(query.getGraphSummary().issues)
    const graphIssues = emptyRoutes(query.getProjectGraph().issues)
    expect(summaryIssues.map((i) => i.routePath).sort()).toEqual(graphIssues.map((i) => i.routePath).sort())
    expect(summaryIssues.length).toBe(3)
  })

  test('CLI --lint 通道：如实打印 [empty-route] 行且退出码=1（发现 issue）', () => {
    const out = runCli([`--root=${dirty}`, '--lint'])
    expect(out).toContain('[empty-route]')
    // 两条幽灵路由都出现在输出里（routePath 透传进 message）。
    expect(out).toContain('pages/ghost/index')
    expect(out).toContain('pages/phantom/index')
    // --lint 发现 issue → 退出码 1（供 CI 门禁），不 fail-fast 抛错。
    expect(process.exitCode).toBe(1)
  })

  test('不误报：所有声明路由都合法时，零 empty-route（其它 kind 的 issue 不算误报）', () => {
    const graph = createProjectGraph({ root: clean }).getProjectGraph()
    // B59 的不变式是「不误报 empty-route」——而非「零 issue」。干净工程仍可能带
    // analysis-incomplete 等合法的其它 kind（如无 page.config/JSX 覆盖度不满），
    // 那不是空路由误报。故只对 empty-route 维度断言为空。
    expect(emptyRoutes(graph.issues)).toEqual([])
    const out = runCli([`--root=${clean}`, '--lint'])
    expect(out).not.toContain('[empty-route]')
  })
})
