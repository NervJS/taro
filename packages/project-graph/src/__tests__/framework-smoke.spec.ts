/**
 * @tarojs/project-graph — 多框架真实工程烟测（WP9c / §9 line229）
 *
 * §9 line229：真实工程烟测覆盖 React / Preact / Solid / Vue3 config-only /
 * framework none（含 Native source），不做全量组合。本 spec 为每种 framework 造一个
 * 最小真实工程（package.json 依赖 + app.config + 一个页面），断言：
 *   - createProjectGraph 建图**不抛**（鲁棒性——真实工程五花八门不能崩）；
 *   - framework 判定命中预期值（§4.1 六值判定：package.json 依赖 / kernel 注入）；
 *   - envelope 基本不变式：schemaVersion='2.0.0'、snapshotId 非空、页面被解析到。
 *
 * framework 判定来源（framework.ts）：
 *   react/preact/solid/vue3 —— package.json 依赖静态推断（本 spec 用框架本体依赖驱动）；
 *   none                    —— 静态阶段不臆造，只经 kernel.initialConfig.framework 显式注入
 *                              （对齐「none 表示确为无框架/dynamic 原生，难静态确证」）。
 */

import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createProjectGraph } from '../index'

import type { KernelLike } from '../index'

/**
 * 造最小真实工程：deps 决定 framework 静态推断，pageBody 决定页面源码形态
 * （Vue3 config-only 用无 JSX 的页面；none/native 用非框架源码）。
 */
function buildProject(deps: Record<string, string>, pageBody: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-smoke-'))
  fs.mkdirSync(path.join(root, 'src/pages/index'), { recursive: true })
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'smoke', dependencies: deps }))
  fs.writeFileSync(path.join(root, 'src/app.config.ts'), "export default { pages: ['pages/index/index'] }\n")
  fs.writeFileSync(path.join(root, 'src/pages/index/index.tsx'), pageBody)
  return root
}

const REACT_PAGE = "import { View } from '@tarojs/components'\nexport default function Index(){ return <View /> }\n"
const PLAIN_PAGE = 'export default function Index(){ return null }\n'

interface ISmokeCase {
  label: string
  deps: Record<string, string>
  pageBody: string
  kernel?: KernelLike
  expectFramework: string
}

const CASES: ISmokeCase[] = [
  { label: 'React（react 依赖）', deps: { react: '^18.0.0' }, pageBody: REACT_PAGE, expectFramework: 'react' },
  { label: 'Preact（preact 依赖，先于 react 判定）', deps: { preact: '^10.0.0', react: '^18.0.0' }, pageBody: REACT_PAGE, expectFramework: 'preact' },
  { label: 'Solid（solid-js 依赖）', deps: { 'solid-js': '^1.0.0' }, pageBody: REACT_PAGE, expectFramework: 'solid' },
  { label: 'Vue3 config-only（vue 依赖 + 无 JSX 页面）', deps: { vue: '^3.0.0' }, pageBody: PLAIN_PAGE, expectFramework: 'vue3' },
  {
    // none：静态不臆造，经 kernel 显式注入 framework='none'（含 Native source 形态——页面为非框架源码）。
    label: 'framework none（kernel 注入 + Native source）',
    deps: {},
    pageBody: PLAIN_PAGE,
    kernel: { initialConfig: { framework: 'none' } },
    expectFramework: 'none',
  },
]

describe('§9 多框架真实工程烟测（React/Preact/Solid/Vue3/none）', () => {
  const created: string[] = []
  afterEach(() => {
    while (created.length) fs.rmSync(created.pop()!, { recursive: true, force: true })
  })

  for (const c of CASES) {
    test(`${c.label}：建图不抛 + framework=${c.expectFramework} + envelope 不变式`, () => {
      const root = buildProject(c.deps, c.pageBody)
      created.push(root)

      // 鲁棒性：真实工程建图绝不能抛。
      const query = createProjectGraph(c.kernel != null ? { root, kernel: c.kernel } : { root })
      const graph = query.getProjectGraph()

      // framework 判定命中预期（§4.1 六值）。
      expect(graph.framework).toBe(c.expectFramework)
      expect(graph.analysisContext.framework).toBe(c.expectFramework)

      // envelope 不变式：版本 / 快照 / 页面解析到。
      expect(graph.schemaVersion).toBe('2.0.0')
      expect(typeof graph.snapshotId).toBe('string')
      expect(graph.snapshotId.length).toBeGreaterThan(0)
      expect(graph.pages.map((p) => p.id)).toContain('pages/index/index')

      query.dispose()
    })
  }
})
