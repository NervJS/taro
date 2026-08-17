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

import { execFileSync } from 'node:child_process'

import { createProjectGraph } from './graph'

import type { ICreateProjectGraphOptions, IProjectGraphQuery, TComponentSelector, TRelationKind } from './query'
import type { IPageNode, IProjectGraph, TComponentSourceKind, TResolution } from './schema'

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
    issueCount: number
  }
  graph: IProjectGraph
}

function buildSummary(graph: IProjectGraph): ProjectGraphResult['summary'] {
  return {
    framework: graph.framework,
    platforms: graph.platforms,
    pageCount: graph.pages.length,
    edgeCount: graph.edges.length,
    pluginCount: graph.plugins.length,
    issueCount: graph.issues.length,
  }
}

/**
 * repo/commit provenance —— schema.ts / 核心 graph 里完全不存在 git 概念，这是 MCP
 * 层的净新探测（§5.2）。用 execFileSync（不过 shell，root 作 cwd 不拼进命令串，无注入面）
 * 读 HEAD commit 与分支名；非 git 仓库 / 无 git 可执行 / 任何异常 → 字段缺省、不抛错
 * （优雅降级：envelope 仍产出，只是 provenance 为 undefined）。
 */
export interface IRepoProvenance {
  /** HEAD commit 完整 sha；不可得时缺省。 */
  commit?: string
  /** 当前分支名（detached HEAD 时可能为 'HEAD'）；不可得时缺省。 */
  branch?: string
}

function probeRepoProvenance(root: string): IRepoProvenance {
  const run = (args: string[]): string | undefined => {
    try {
      return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined
    } catch {
      return undefined
    }
  }
  return { commit: run(['rev-parse', 'HEAD']), branch: run(['rev-parse', '--abbrev-ref', 'HEAD']) }
}

/**
 * MCP 边界输入校验：把宿主传入的 unknown 参数收窄为 TComponentSelector（结构化 JSON，
 * 直接对齐 §5.1 三态，不走 CLI 的字符串前缀编码）。三键互斥，缺失或非法 → 抛错，由
 * host 转成工具错误响应（不静默塞空 selector 造成误命中）。
 */
function parseSelectorArg(args: Record<string, unknown>): TComponentSelector {
  const exportName = typeof args.exportName === 'string' ? args.exportName : undefined
  if (typeof args.byId === 'string') return { byId: args.byId, exportName }
  if (typeof args.bySpecifier === 'string') return { bySpecifier: args.bySpecifier, exportName }
  if (typeof args.byFilePath === 'string') return { byFilePath: args.byFilePath, exportName }
  throw new Error('组件选择器缺失：需提供 byId / bySpecifier / byFilePath 之一（字符串）')
}

/** selector 三键的公共 inputSchema 片段（byId/bySpecifier/byFilePath 互斥 + 可选 exportName）。 */
const SELECTOR_PROPS = {
  byId: { type: 'string', description: '按 ComponentNode.id 精确选（三类主键串）' },
  bySpecifier: { type: 'string', description: '按原始 specifier / 包名 / 包名+子路径选' },
  byFilePath: { type: 'string', description: '按 local 组件解析后真实文件绝对路径选' },
  exportName: { type: 'string', description: '可选：按具名导出进一步过滤' },
} as const

/**
 * MCP 边界输入校验：把 unknown 参数收窄为 findUsingComponents 的 owner（四态互斥）。
 * app=true → app 全局；pageId / componentId → 对应节点；缺失或非法 → 抛错。
 */
function parseOwnerArg(args: Record<string, unknown>): { app: true } | { pageId: string } | { componentId: string } {
  if (args.app === true) return { app: true }
  if (typeof args.pageId === 'string') return { pageId: args.pageId }
  if (typeof args.componentId === 'string') return { componentId: args.componentId }
  throw new Error('owner 缺失：需提供 app=true / pageId / componentId 之一')
}

/**
 * 四通道共享的响应 envelope（§5.2）：schemaVersion / snapshotId / analysisContext /
 * capabilities / issues / counts 直接取自 Query.getGraphSummary()（不重造），叠加 root
 * 标识与 repo/commit provenance。每个新工具的结果都套此 envelope，保证跨通道一致。
 */
export interface IMcpEnvelope {
  schemaVersion: string
  snapshotId: string
  root: string
  repo: IRepoProvenance
  analysisContext: ReturnType<IProjectGraphQuery['getGraphSummary']>['analysisContext']
  capabilities: ReturnType<IProjectGraphQuery['getGraphSummary']>['capabilities']
  issues: ReturnType<IProjectGraphQuery['getGraphSummary']>['issues']
  counts: ReturnType<IProjectGraphQuery['getGraphSummary']>['counts']
}

/**
 * 创建本库的 MCP 工具定义组。
 *
 * @param options 与 createProjectGraph 相同的构建入参（root + 可选 kernel）；
 *   host 负责决定 root 来源（如当前工作区）。
 *
 * §5.2 契约：所有 handler **共享同一个 Query 实例**——首个工具调用时惰性构建一次并
 * 缓存，后续复用（避免每次重解析、保证同批工具 snapshotId 一致）。createMcpTools
 * 本身零副作用（不解析、不启 watcher）；watcher 仅在有人 onGraphChange 时才惰性启动，
 * MCP 不订阅故不泄漏句柄。
 */
export function createMcpTools(options: ICreateProjectGraphOptions): McpToolDefinition[] {
  let shared: IProjectGraphQuery | undefined
  const query = (): IProjectGraphQuery => (shared ??= createProjectGraph(options))
  // repo provenance 与 root 在一批工具生命周期内固定，首用时探测一次并缓存。
  let repo: IRepoProvenance | undefined
  const envelope = (): IMcpEnvelope => {
    const s = query().getGraphSummary()
    repo ??= probeRepoProvenance(options.root)
    return {
      schemaVersion: s.schemaVersion,
      snapshotId: s.snapshotId,
      root: options.root,
      repo,
      analysisContext: s.analysisContext,
      capabilities: s.capabilities,
      issues: s.issues,
      counts: s.counts,
    }
  }

  return [
    {
      // §5.2「不默认返回全图」复核（WP8b）：本工具无参即返回完整图，属重型 payload。
      // 决策=保留（P1 遗留豁免）——已有消费方（如 taro-pilot inspector）依赖其完整图形状，
      // 收窄会破坏兼容；新增的 get_graph_summary 已提供轻量默认入口。故不改返回形状，仅在
      // description 明确其重型定位并引导 agent 优先用 get_graph_summary，避免默认拉全图。
      name: 'query_project_graph',
      description:
        '【重型】解析当前 Taro 项目并返回完整结构化项目图（全部页面/边/插件/平台）+ 摘要。仅当确需完整图全量数据时使用；只需概览/计数/版本时请优先用更轻量的 get_graph_summary。',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      handler: (): ProjectGraphResult => {
        const graph = query().getProjectGraph()
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
      handler: (args: Record<string, unknown>): IPageNode | null => {
        const routePath = typeof args.routePath === 'string' ? args.routePath : ''
        const page = query().findPageByRoute(routePath)
        return page ?? null
      },
    },
    {
      name: 'get_graph_summary',
      description:
        '取当前 Taro 项目图的轻量摘要 envelope（schemaVersion / snapshotId / root / repo commit / 分析上下文 / 能力 / issues / 计数），不返回完整图。用作 agent 的默认低成本概览入口。',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      handler: (): IMcpEnvelope => envelope(),
    },
    {
      name: 'find_component_dependencies',
      description:
        '从某组件出发查其组件依赖：direct（默认，仅直接依赖）或 transitive（沿 local 组件递归，npm 为终点）。支持 maxDepth / limit 限界（截断标 truncated）与 relationKinds / resolutions 过滤。结果套统一 envelope。',
      inputSchema: {
        type: 'object',
        properties: {
          ...SELECTOR_PROPS,
          mode: { type: 'string', enum: ['direct', 'transitive'], description: 'direct（默认）/ transitive' },
          relationKinds: {
            type: 'array',
            items: { type: 'string', enum: ['usingComponent', 'componentUsage'] },
            description: '仅沿这些 relation kind 展开；缺省为双 kind 并集',
          },
          resolutions: {
            type: 'array',
            items: { type: 'string' },
            description: '仅返回这些解析终态的引用（缺省全部）',
          },
          maxDepth: { type: 'number', description: 'transitive 最大深度（必须可证明收敛）' },
          limit: { type: 'number', description: '返回条数上限（截断时 truncated=true）' },
        },
        additionalProperties: false,
      },
      handler: (args: Record<string, unknown>) => {
        const selector = parseSelectorArg(args)
        const result = query().findComponentDependencies(selector, {
          mode: args.mode === 'transitive' ? 'transitive' : args.mode === 'direct' ? 'direct' : undefined,
          relationKinds: Array.isArray(args.relationKinds) ? (args.relationKinds as TRelationKind[]) : undefined,
          resolutions: Array.isArray(args.resolutions) ? (args.resolutions as TResolution[]) : undefined,
          maxDepth: typeof args.maxDepth === 'number' ? args.maxDepth : undefined,
          limit: typeof args.limit === 'number' ? args.limit : undefined,
        })
        return { ...envelope(), result }
      },
    },
    {
      name: 'find_using_components',
      description:
        'config 专项：列出某 owner（app 全局 / 某页面 / 某组件）在其 config 中声明的 usingComponents 边。owner 三态互斥：app=true / pageId / componentId。结果套统一 envelope。',
      inputSchema: {
        type: 'object',
        properties: {
          app: { type: 'boolean', description: '取 app 全局 usingComponents（与 pageId/componentId 互斥）' },
          pageId: { type: 'string', description: '按页面 id 取其 config 声明' },
          componentId: { type: 'string', description: '按组件 id 取其 config 声明' },
        },
        additionalProperties: false,
      },
      handler: (args: Record<string, unknown>) => {
        const result = query().findUsingComponents(parseOwnerArg(args))
        return { ...envelope(), result }
      },
    },
    {
      name: 'find_references_to_component',
      description:
        '反向引用：列出所有指向 selector 命中组件的边（usingComponent ∪ componentUsage）。selector 三态：byId / bySpecifier / byFilePath（可选 exportName）。结果套统一 envelope。',
      inputSchema: {
        type: 'object',
        properties: { ...SELECTOR_PROPS },
        additionalProperties: false,
      },
      handler: (args: Record<string, unknown>) => {
        const result = query().findReferencesToComponent(parseSelectorArg(args))
        return { ...envelope(), result }
      },
    },
    {
      name: 'find_component_reference_at',
      description:
        '位置定位：在源文件某行列处命中的组件引用边（IDE 红线 / 跳转支撑）。line/column 均 1-based；未命中返回 result=null。结果套统一 envelope。',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: { type: 'string', description: '源文件绝对路径' },
          line: { type: 'number', description: '1-based 行号' },
          column: { type: 'number', description: '1-based 列号' },
        },
        required: ['filePath', 'line', 'column'],
        additionalProperties: false,
      },
      handler: (args: Record<string, unknown>) => {
        const filePath = typeof args.filePath === 'string' ? args.filePath : ''
        const line = typeof args.line === 'number' ? args.line : 0
        const column = typeof args.column === 'number' ? args.column : 0
        const result = query().findComponentReferenceAt(filePath, { line, column }) ?? null
        return { ...envelope(), result }
      },
    },
    {
      name: 'list_component_references',
      description:
        '通用批量：按 relationKinds / resolutions / fromKinds / targetKinds / degradedOnly / limit 过滤列出组件引用边，用于 lint、诊断聚合、能力目录等消费型投影。结果套统一 envelope。',
      inputSchema: {
        type: 'object',
        properties: {
          relationKinds: {
            type: 'array',
            items: { type: 'string', enum: ['usingComponent', 'componentUsage'] },
            description: '按 relation kind 过滤',
          },
          resolutions: { type: 'array', items: { type: 'string' }, description: '按解析终态过滤（如 unresolved/external）' },
          fromKinds: {
            type: 'array',
            items: { type: 'string', enum: ['app', 'page', 'component'] },
            description: '按源节点类型过滤',
          },
          targetKinds: { type: 'array', items: { type: 'string' }, description: '按目标 ComponentNode.sourceKind 过滤' },
          degradedOnly: { type: 'boolean', description: '只返回 degraded（owner analyzer 非 complete）派生的引用' },
          limit: { type: 'number', description: '返回条数上限' },
        },
        additionalProperties: false,
      },
      handler: (args: Record<string, unknown>) => {
        const result = query().listComponentReferences({
          relationKinds: Array.isArray(args.relationKinds) ? (args.relationKinds as TRelationKind[]) : undefined,
          resolutions: Array.isArray(args.resolutions) ? (args.resolutions as TResolution[]) : undefined,
          fromKinds: Array.isArray(args.fromKinds) ? (args.fromKinds as Array<'app' | 'page' | 'component'>) : undefined,
          targetKinds: Array.isArray(args.targetKinds) ? (args.targetKinds as TComponentSourceKind[]) : undefined,
          degradedOnly: typeof args.degradedOnly === 'boolean' ? args.degradedOnly : undefined,
          limit: typeof args.limit === 'number' ? args.limit : undefined,
        })
        return { ...envelope(), result }
      },
    },
  ]
}
