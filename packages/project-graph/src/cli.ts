#!/usr/bin/env node
/**
 * @tarojs/project-graph — CLI 入口（任务 4，独立入口，不进核心库）
 *
 * 按计划 §5.2 CLI 四通道投影：
 *  - `taro-graph`                     打印概览（含 formatOverview 详情 + summary envelope 尾行）
 *  - `taro-graph --route=/pages/x`    查询单条路由并打印命中详情
 *  - `taro-graph --component=<value>` 查询组件依赖；--recursive 切 transitive，--max-depth=/--limit= 限界
 *  - `taro-graph --lint`              打印 GraphIssue（含 empty-route）
 *  - `taro-graph --json`              输出稳定 JSON（外部脚本可解析）
 *  - `--link`                         route 的 file 行渲染为 file://<绝对路径>:1:1（可点击跳转）
 *  - `--root=<dir>`                   项目根目录（默认 cwd；内部规整为绝对路径，供 --link 可靠输出绝对 file://）
 *
 * --component 选择器编码：`id:<ComponentNode.id>` / `file:<resolvedFilePath>`；
 * 裸值（无前缀）按原始 specifier 处理（TComponentSelector.bySpecifier）。
 *
 * 退出码：0 成功；1 表示查询未命中/歧义（--route / --component）或 --lint 发现问题。
 *
 * 薄 façade：只做 argv 解析 + 调用核心 createProjectGraph/Query + 格式化输出，不含
 * 解析/诊断逻辑。核心库（index.ts）不包含本文件。
 */

import * as path from 'node:path'

import { createProjectGraph } from './graph'

import type { IProjectGraphQuery, TComponentSelector } from './query'
import type { INavigationEdge, IProjectGraph } from './schema'

interface CliOptions {
  root: string
  json: boolean
  route?: string
  component?: string
  recursive?: boolean
  maxDepth?: number
  limit?: number
  link?: boolean
  lint?: boolean
}

/** 从 argv 解析选项。新增布尔项缺省时留 undefined（不可初始化为 false，否则破坏既有 toEqual 断言）。 */
export function parseCliArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { root: process.cwd(), json: false }
  for (const arg of argv) {
    if (arg === '--json') opts.json = true
    else if (arg === '--recursive') opts.recursive = true
    else if (arg === '--link') opts.link = true
    else if (arg === '--lint') opts.lint = true
    else if (arg.startsWith('--route=')) opts.route = arg.slice('--route='.length)
    else if (arg.startsWith('--root=')) opts.root = path.resolve(arg.slice('--root='.length))
    else if (arg.startsWith('--component=')) opts.component = arg.slice('--component='.length)
    else if (arg.startsWith('--max-depth=')) opts.maxDepth = Number(arg.slice('--max-depth='.length))
    else if (arg.startsWith('--limit=')) opts.limit = Number(arg.slice('--limit='.length))
  }
  return opts
}

/** --component=<value> → TComponentSelector。id: / file: 前缀精确指定主键类别，否则按原始 specifier 处理。 */
export function parseComponentSelector(value: string): TComponentSelector {
  if (value.startsWith('id:')) return { byId: value.slice('id:'.length) }
  if (value.startsWith('file:')) return { byFilePath: value.slice('file:'.length) }
  return { bySpecifier: value }
}

/** 文本概览（人类可读）。保留既有详情，尾部叠加 summary envelope（schemaVersion/snapshotId），不做替换。 */
function formatOverview(query: IProjectGraphQuery, graph: IProjectGraph): string {
  const lines: string[] = []
  lines.push(`framework: ${graph.framework}   platforms: [${graph.platforms.join(', ')}]`)
  lines.push(`pages: ${graph.pages.length}   edges: ${graph.edges.length}   plugins: ${graph.plugins.length}   issues: ${graph.issues.length}`)
  if (graph.plugins.length === 0 && graph.platforms.length === 0) {
    lines.push('(插件与平台需注入 Kernel 才可见；CLI 独立运行未注入，故为空)')
  }
  lines.push('')
  lines.push('Pages:')
  for (const p of graph.pages) {
    lines.push(`  ${p.id}${p.inSubpackage ? `  [subpackage ${p.inSubpackage}]` : ''}`)
  }
  // 边为三成员联合，只有 navigation 边有 via/to/resolved；先按 kind 收窄再列。
  const navEdges = graph.edges.filter((e): e is INavigationEdge => e.kind === 'navigation')
  if (navEdges.length > 0) {
    lines.push('')
    lines.push('Navigation:')
    for (const e of navEdges) {
      lines.push(`  ${e.from}  --${e.via}-->  ${e.to}${e.resolved === false ? '  (broken)' : ''}`)
    }
  }
  if (graph.issues.length > 0) {
    lines.push('')
    lines.push('Issues:')
    for (const w of graph.issues) lines.push(`  [${w.kind}] ${w.message}`)
  }
  const summary = query.getGraphSummary()
  lines.push('')
  lines.push(`schemaVersion: ${summary.schemaVersion}   snapshotId: ${summary.snapshotId}`)
  return lines.join('\n')
}

/** 单路由查询的文本输出。复用查询层，保证与 MCP find_page_by_route 归一化一致。--link 时 file 行渲染为 file://:1:1。 */
function formatRoute(query: IProjectGraphQuery, route: string, link: boolean | undefined): { text: string, ok: boolean } {
  const page = query.findPageByRoute(route)
  if (page == null) return { text: `路由 ${route} 未找到对应页面`, ok: false }
  const refs = query.findReferencesToPage(page.id)
  const text = [
    `route: ${page.routePath}`,
    `file: ${link ? query.pageToFileUrl(page.id) : page.filePath}`,
    `config: ${page.configFilePath || '(无)'}`,
    `subpackage: ${page.inSubpackage ?? '(主包)'}`,
    `被跳转引用: ${refs.length} 处`,
  ].join('\n')
  return { text, ok: true }
}

/** --component 查询的文本输出。--recursive 切 transitive；--max-depth=/--limit= 传入对应查询选项。 */
function formatComponent(query: IProjectGraphQuery, opts: CliOptions): { text: string, ok: boolean } {
  const selector = parseComponentSelector(opts.component!)
  let result: ReturnType<IProjectGraphQuery['findComponentDependencies']>
  try {
    result = query.findComponentDependencies(selector, {
      mode: opts.recursive ? 'transitive' : 'direct',
      maxDepth: opts.maxDepth,
      limit: opts.limit,
    })
  } catch (err) {
    return { text: `组件 ${opts.component} 查询失败：${(err as Error).message}`, ok: false }
  }
  const lines: string[] = []
  lines.push(`root: ${result.root.id}`)
  lines.push(`edges: ${result.edges.length}   components: ${result.components.length}${result.truncated ? '   (truncated)' : ''}`)
  for (const c of result.components) lines.push(`  ${c.id}`)
  return { text: lines.join('\n'), ok: true }
}

/** --lint 输出：图级 GraphIssue 列表（含 empty-route）。 */
function formatLint(graph: IProjectGraph): string {
  if (graph.issues.length === 0) return '(无 issue)'
  return graph.issues.map((w) => `[${w.kind}] ${w.message}`).join('\n')
}

/**
 * CLI 主逻辑。返回要打印的字符串（便于测试），不直接 process.exit——通过 process.exitCode
 * 传递退出码（0 成功；1 表示 --route/--component 未命中或歧义、或 --lint 发现 issue）。
 */
export function runCli(argv: string[]): string {
  process.exitCode = 0
  const opts = parseCliArgs(argv)
  const query = createProjectGraph({ root: opts.root })
  const graph = query.getProjectGraph()
  if (opts.json) return JSON.stringify(graph, null, 2)
  if (opts.component != null) {
    const { text, ok } = formatComponent(query, opts)
    if (!ok) process.exitCode = 1
    return text
  }
  if (opts.route != null) {
    const { text, ok } = formatRoute(query, opts.route, opts.link)
    if (!ok) process.exitCode = 1
    return text
  }
  if (opts.lint) {
    if (graph.issues.length > 0) process.exitCode = 1
    return formatLint(graph)
  }
  return formatOverview(query, graph)
}

// 作为 bin 执行时运行（被 import 时不执行）
if (require.main === module) {
  // eslint-disable-next-line no-console
  console.log(runCli(process.argv.slice(2)))
}
