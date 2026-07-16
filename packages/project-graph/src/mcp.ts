/**
 * @tarojs/project-graph — MCP 工具定义（任务 4，独立入口，不进核心库）
 *
 * 按计划 §2.5：MCP 工具挂载在现有 plugin-mcp（RFC-0009）之上，本库不自带 MCP
 * server / SDK。此处只导出**传输无关的工具定义**（name + description + inputSchema
 * + handler），由 plugin-mcp 或任意 MCP host 注册。这样不引入 @modelcontextprotocol
 * 依赖，符合「挂现有 server」与「薄 façade」。
 *
 * P1 两个原子工具：query_project_graph（取图/摘要）、find_page_by_route（按路由查页）。
 */

import { createProjectGraph } from './graph'

import type { CreateProjectGraphOptions } from './query'
import type { PageNode, ProjectGraph } from './schema'

/** 传输无关的工具定义。inputSchema 用 JSON Schema 描述参数。 */
export interface McpToolDefinition {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  handler: (args: Record<string, unknown>) => unknown
}

/** query_project_graph 的返回：完整图 + 一份轻量摘要，便于 agent 概览。 */
export interface ProjectGraphResult {
  summary: {
    framework: string
    platforms: string[]
    pageCount: number
    edgeCount: number
    pluginCount: number
    warningCount: number
  }
  graph: ProjectGraph
}

function buildSummary(graph: ProjectGraph): ProjectGraphResult['summary'] {
  return {
    framework: graph.framework,
    platforms: graph.platforms,
    pageCount: graph.pages.length,
    edgeCount: graph.edges.length,
    pluginCount: graph.plugins.length,
    warningCount: graph.warnings.length,
  }
}

/**
 * 创建本库的 MCP 工具定义组。
 *
 * @param options 与 createProjectGraph 相同的构建入参（root + 可选 kernel）；
 *   每次工具调用基于此构建/查询图。host 负责决定 root 来源（如当前工作区）。
 */
export function createMcpTools(options: CreateProjectGraphOptions): McpToolDefinition[] {
  return [
    {
      name: 'query_project_graph',
      description:
        '解析当前 Taro 项目，返回结构化项目图（页面、跳转关系、插件、平台）与一份摘要。用于回答"项目有多少页面/插件、有哪些跳转、结构如何"类问题。',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      handler: (): ProjectGraphResult => {
        const graph = createProjectGraph(options).getProjectGraph()
        return { summary: buildSummary(graph), graph }
      },
    },
    {
      name: 'find_page_by_route',
      description:
        '按路由路径（如 /pages/index/index）在当前 Taro 项目中查找页面节点，返回其文件路径、配置路径、所属分包等信息；未找到返回 null。',
      inputSchema: {
        type: 'object',
        properties: {
          routePath: {
            type: 'string',
            description: '页面路由路径，如 /pages/index/index',
          },
        },
        required: ['routePath'],
        additionalProperties: false,
      },
      handler: (args: Record<string, unknown>): PageNode | null => {
        const routePath = typeof args.routePath === 'string' ? args.routePath : ''
        const page = createProjectGraph(options).findPageByRoute(routePath)
        return page ?? null
      },
    },
  ]
}
