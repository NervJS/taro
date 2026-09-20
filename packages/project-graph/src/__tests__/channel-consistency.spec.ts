/**
 * @tarojs/project-graph — 五通道一致性集成测试（WP8c / §5.2 四通道投影 + Query 直调）
 *
 * 同一 fixture（mini-app）喂五个消费通道，验证它们对核心事实字段给出**一致**的投影：
 *  1. Query API 直调   —— createProjectGraph(...).getProjectGraph() / getGraphSummary()
 *  2. JSON            —— getProjectGraph() 的 JSON 序列化（外部脚本可解析形态）
 *  3. CLI             —— runCli(['--root=...','--json'])
 *  4. MCP             —— createMcpTools(...) 的 query_project_graph / get_graph_summary handler
 *  5. Taro Plugin     —— graph 命令 --json（fake ctx 注入）
 *
 * 一致性维度：snapshotId（确定性 manifest hash，单一出处）、schemaVersion、pages/components
 * 计数、首页 filePath。五通道同源同实现，任一通道自行解析/走偏都会破坏此不变式。
 *
 * 另验证「同一 root 只解析一次」的成本契约不是靠通道数量放大解析——各通道各建实例是允许的
 * （snapshotId 因确定性 hash 仍相等），但同一 MCP tool-set 内必须共享单实例（见 mcp.spec 的
 * build-once 断言，本文件复核其对外可观测结果：MCP summary 与其它通道 snapshotId 一致）。
 */

import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { runCli } from '../cli'
import { createProjectGraph } from '../graph'
import { createMcpTools } from '../mcp'
import projectGraphPlugin from '../taro-plugin'

import type { IProjectGraph } from '../schema'

const FIXTURE = path.join(__dirname, 'fixtures', 'mini-app')

function copyFixture(): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-consistency-'))
  fs.cpSync(path.join(FIXTURE, 'src'), path.join(tmp, 'src'), { recursive: true })
  fs.cpSync(path.join(FIXTURE, 'package.json'), path.join(tmp, 'package.json'))
  return tmp
}

/** 最小 fake 插件 ctx，仅够驱动 graph 命令 --json。 */
interface ICommandLike {
  name: string
  fn: () => void
}
function makeFakeCtx(root: string, runOptions: Record<string, unknown>) {
  const commands: ICommandLike[] = []
  const kernel: Record<string, unknown> = {
    appPath: root,
    initialConfig: { sourceRoot: 'src', alias: {} },
    plugins: new Map(),
    hooks: new Map(),
    commands: new Map(),
    platforms: new Map(),
  }
  const ctx = {
    appPath: root,
    ctx: kernel,
    runOpts: { options: runOptions },
    onBuildStart: () => {},
    registerCommand: (cmd: ICommandLike) => { commands.push(cmd) },
  }
  return { ctx, commands }
}

/** 捕获一次 console.log 的首参（各入口都用 console.log 打印 JSON）。 */
function captureLog(fn: () => void): string {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
  try {
    fn()
    return spy.mock.calls[0][0] as string
  } finally {
    spy.mockRestore()
  }
}

describe('五通道一致性（Query / JSON / CLI / MCP / Plugin）', () => {
  let root: string
  beforeEach(() => {
    root = copyFixture()
    // 叠加一个被首页引用的本地组件链（Card→Sub），使 components 计数非零——否则组件维度的
    // 跨通道一致性断言会退化为 0===0 的空验证（对"组件事实层"这个 P2 核心无意义）。
    fs.mkdirSync(path.join(root, 'src/components'), { recursive: true })
    fs.writeFileSync(path.join(root, 'src/components/Card.tsx'), 'export default function Card(){ return null }\n')
    fs.writeFileSync(path.join(root, 'src/components/Card.config.ts'), "export default { usingComponents: { Sub: './Sub' } }\n")
    fs.writeFileSync(path.join(root, 'src/components/Sub.tsx'), 'export default function Sub(){ return null }\n')
    fs.writeFileSync(
      path.join(root, 'src/pages/index/index.config.ts'),
      "export default {\n  navigationBarTitleText: '首页',\n  usingComponents: {\n    Card: '../../components/Card',\n  },\n}\n",
    )
  })
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
    process.exitCode = undefined
  })

  test('snapshotId / schemaVersion / pages 计数 / 首页 filePath 五通道一致', () => {
    // 1. Query 直调
    const query = createProjectGraph({ root })
    const qGraph = query.getProjectGraph()
    const qSummary = query.getGraphSummary()

    // 2. JSON（getProjectGraph 序列化）
    const jsonGraph = JSON.parse(JSON.stringify(qGraph)) as IProjectGraph

    // 3. CLI --json
    const cliGraph = JSON.parse(runCli([`--root=${root}`, '--json'])) as IProjectGraph

    // 4. MCP：query_project_graph（完整图）+ get_graph_summary（envelope）
    const tools = createMcpTools({ root })
    const mcpFull = tools.find((t) => t.name === 'query_project_graph')!.handler({}) as { graph: IProjectGraph }
    const mcpSummary = tools.find((t) => t.name === 'get_graph_summary')!.handler({}) as { snapshotId: string, schemaVersion: string, counts: { pages: number } }

    // 5. Taro Plugin：graph --json
    const { ctx, commands } = makeFakeCtx(root, { json: true })
    projectGraphPlugin(ctx as never)
    const graphCmd = commands.find((c) => c.name === 'graph')!
    const pluginGraph = JSON.parse(captureLog(() => graphCmd.fn())) as IProjectGraph

    // ---- snapshotId：全通道同源确定性 hash，必须逐一相等 ----
    const snap = qGraph.snapshotId
    expect(typeof snap).toBe('string')
    expect(snap.length).toBeGreaterThan(0)
    expect(qSummary.snapshotId).toBe(snap)
    expect(jsonGraph.snapshotId).toBe(snap)
    expect(cliGraph.snapshotId).toBe(snap)
    expect(mcpFull.graph.snapshotId).toBe(snap)
    expect(mcpSummary.snapshotId).toBe(snap)
    expect(pluginGraph.snapshotId).toBe(snap)

    // ---- schemaVersion：全通道 '2.0.0' ----
    expect(qGraph.schemaVersion).toBe('2.0.0')
    expect(cliGraph.schemaVersion).toBe('2.0.0')
    expect(mcpSummary.schemaVersion).toBe('2.0.0')
    expect(pluginGraph.schemaVersion).toBe('2.0.0')

    // ---- pages 计数：五通道相等（fixture 为 2 页）----
    const pages = qGraph.pages.length
    expect(pages).toBe(2)
    expect(jsonGraph.pages.length).toBe(pages)
    expect(cliGraph.pages.length).toBe(pages)
    expect(mcpFull.graph.pages.length).toBe(pages)
    expect(mcpSummary.counts.pages).toBe(pages)
    expect(pluginGraph.pages.length).toBe(pages)

    // ---- components 计数：完整图通道相等，且非零（叠加了 Card→Sub 组件链）----
    const comps = qGraph.components.length
    expect(comps).toBeGreaterThan(0)
    expect(cliGraph.components.length).toBe(comps)
    expect(mcpFull.graph.components.length).toBe(comps)
    expect(pluginGraph.components.length).toBe(comps)
    expect(mcpSummary.counts.components).toBe(comps)
    // 组件 id 集合跨通道逐一相等（不仅计数，身份也一致——防"数量对但身份错位"）。
    const compIds = qGraph.components.map((c) => c.id).sort()
    expect(cliGraph.components.map((c) => c.id).sort()).toEqual(compIds)
    expect(pluginGraph.components.map((c) => c.id).sort()).toEqual(compIds)

    // ---- edges 计数：完整图通道相等（fixture 有 navigation 边，非空校验避免空图误过）----
    const edges = qGraph.edges.length
    expect(edges).toBeGreaterThan(0)
    expect(cliGraph.edges.length).toBe(edges)
    expect(mcpFull.graph.edges.length).toBe(edges)
    expect(pluginGraph.edges.length).toBe(edges)

    // ---- 首页 filePath：跨通道逐字段相等（页序稳定）----
    const firstFile = qGraph.pages[0].filePath
    expect(typeof firstFile).toBe('string')
    expect(cliGraph.pages[0].filePath).toBe(firstFile)
    expect(mcpFull.graph.pages[0].filePath).toBe(firstFile)
    expect(pluginGraph.pages[0].filePath).toBe(firstFile)
  })
})
