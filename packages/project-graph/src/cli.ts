#!/usr/bin/env node
/**
 * @tarojs/project-graph — CLI 入口（任务 4，独立入口，不进核心库）
 *
 * 按计划 §2.5 CLI + JSON 两通道：
 *  - `taro-graph`                 打印当前项目的页面 / 跳转 / 插件 概览
 *  - `taro-graph --route=/pages/x` 查询单条路由并打印命中详情
 *  - `taro-graph --json`          输出稳定 JSON（外部脚本可解析）
 *
 * 薄 façade：只做 argv 解析 + 调用核心 createProjectGraph + 格式化输出，不含
 * 解析/诊断逻辑。核心库（index.ts）不包含本文件。
 */

import { createProjectGraph } from './graph'

import type { ProjectGraphQuery } from './query'
import type { ProjectGraph } from './schema'

interface CliOptions {
  root: string
  json: boolean
  route?: string
}

/** 从 argv 解析选项。--json / --route=X / --root=X（默认 cwd）。 */
export function parseCliArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { root: process.cwd(), json: false }
  for (const arg of argv) {
    if (arg === '--json') opts.json = true
    else if (arg.startsWith('--route=')) opts.route = arg.slice('--route='.length)
    else if (arg.startsWith('--root=')) opts.root = arg.slice('--root='.length)
  }
  return opts
}

/** 文本概览（人类可读）。 */
function formatOverview(graph: ProjectGraph): string {
  const lines: string[] = []
  lines.push(`framework: ${graph.framework}   platforms: [${graph.platforms.join(', ')}]`)
  lines.push(`pages: ${graph.pages.length}   edges: ${graph.edges.length}   plugins: ${graph.plugins.length}   warnings: ${graph.warnings.length}`)
  if (graph.plugins.length === 0 && graph.platforms.length === 0) {
    lines.push('(插件与平台需注入 Kernel 才可见；CLI 独立运行未注入，故为空)')
  }
  lines.push('')
  lines.push('Pages:')
  for (const p of graph.pages) {
    lines.push(`  ${p.id}${p.inSubpackage ? `  [subpackage ${p.inSubpackage}]` : ''}`)
  }
  if (graph.edges.length > 0) {
    lines.push('')
    lines.push('Navigation:')
    for (const e of graph.edges) {
      lines.push(`  ${e.from}  --${e.via}-->  ${e.to}${e.resolved === false ? '  (broken)' : ''}`)
    }
  }
  if (graph.warnings.length > 0) {
    lines.push('')
    lines.push('Warnings:')
    for (const w of graph.warnings) lines.push(`  [${w.kind}] ${w.message}`)
  }
  return lines.join('\n')
}

/** 单路由查询的文本输出。复用查询层，保证与 MCP find_page_by_route 归一化一致。 */
function formatRoute(query: ProjectGraphQuery, route: string): string {
  const page = query.findPageByRoute(route)
  if (page == null) return `路由 ${route} 未找到对应页面`
  const refs = query.findReferencesToPage(page.id)
  return [
    `route: ${page.routePath}`,
    `file: ${page.filePath}`,
    `config: ${page.configFilePath || '(无)'}`,
    `subpackage: ${page.inSubpackage ?? '(主包)'}`,
    `被跳转引用: ${refs.length} 处`,
  ].join('\n')
}

/**
 * CLI 主逻辑。返回要打印的字符串（便于测试），不直接 process.exit。
 */
export function runCli(argv: string[]): string {
  const opts = parseCliArgs(argv)
  const query = createProjectGraph({ root: opts.root })
  const graph = query.getProjectGraph()
  if (opts.json) return JSON.stringify(graph, null, 2)
  if (opts.route != null) return formatRoute(query, opts.route)
  return formatOverview(graph)
}

// 作为 bin 执行时运行（被 import 时不执行）
if (require.main === module) {
  // eslint-disable-next-line no-console
  console.log(runCli(process.argv.slice(2)))
}
