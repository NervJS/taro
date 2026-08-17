/**
 * @tarojs/project-graph — Query API 2.0 契约稿（WP1 冻结，不实现）
 *
 * 契约依据：taro-meta `rfcs/0003-project-graph-p2-plan.md`（下称 P2 计划）§5.1。
 * 本文件仅冻结公共接口面：方法签名 + jsdoc + 类型参数/返回值，**实现归 WP6a/WP6b**。
 *
 * 2.0 API 面（P2 计划 §5.1 单一出处）：
 *  ┌────────────────────────┬──────────────┬─────────────────────────────────┐
 *  │ 查询                   │ 来源         │ 说明                            │
 *  ├────────────────────────┼──────────────┼─────────────────────────────────┤
 *  │ createProjectGraph      │ P1 保留·改名 │ 工厂入口                        │
 *  │ getProjectGraph         │ P1 保留·改名 │ 仅接受精确 '2.0.0'              │
 *  │ findPageByRoute         │ P1 保留·改名 │ 页面查询                        │
 *  │ findPageByFilePath      │ P1 保留·改名 │ 页面查询                        │
 *  │ findReferencesToPage    │ P1 保留·改名 │ 反查导航到页面 edge             │
 *  │ getPlatforms / getPlugins / findPluginById │ P1 保留·改名 │ 平台/插件（Kernel 期可信，OQ-016）│
 *  │ onGraphChange           │ P1 保留·改名 │ dev-time 订阅                   │
 *  │ pageToFileUrl           │ P2 新增     │ file://:1:1 编辑器/终端跳转    │
 *  │ findComponentDependencies │ P2 新增  │ 主查询：direct / transitive     │
 *  │ findUsingComponents     │ P2 新增     │ config 专项                     │
 *  │ findReferencesToComponent │ P2 新增  │ 反向引用                        │
 *  │ findComponentReferenceAt │ P2 新增   │ 位置定位 / 跳转                 │
 *  │ listComponentReferences │ P2 新增     │ unresolved/external/degraded 批量 │
 *  └────────────────────────┴──────────────┴─────────────────────────────────┘
 *
 * 边界（P2 计划 §1.2 / §5.2 / §8）：
 *  - 消费方（CLI / JSON / MCP / taro-plugin）只依赖本接口，不读内部 parser/resolver/cache。
 *  - MCP handlers 必须共享一个 Query 实例；CLI/JSON 不得自行解析源码。
 *  - 所有实现体（graph.ts 等）在 WP2+ 落地；WP1 只冻结签名。
 */

import type {
  IAnalysisContext,
  ICapabilities,
  IComponentNode,
  IEdge,
  IGraphIssue,
  INavigationEdge,
  IPageNode,
  IPluginNode,
  IProjectGraph,
  TComponentRef,
  TComponentSourceKind,
  TNodeRef,
  TPageRef,
  TResolution,
  TSchemaVersion,
} from './schema'

// =============================================================================
// Kernel 鸭子类型（P1 保留 · 原名保留；属注入面，不是 graph schema）
// =============================================================================

/**
 * Kernel 注册表里插件相关条目的最小形状（鸭子类型）。
 * 本库不硬依赖 @tarojs/service（P1/P2 边界一致）。
 */
export interface KernelPluginEntry {
  id: string
  [key: string]: unknown
}

export interface KernelCommandEntry {
  name: string
  alias?: string
  optionsMap?: Record<string, string>
  synopsisList?: string[]
  /** 注册该命令的插件 id（解析后路径）。 */
  plugin?: string
  [key: string]: unknown
}

export interface KernelPlatformEntry {
  name: string
  /** 注册该平台的插件 id（解析后路径）。 */
  plugin?: string
  [key: string]: unknown
}

export interface KernelHookEntry {
  name: string
  /** 注册该 hook 的插件 id（解析后路径）。 */
  plugin?: string
  [key: string]: unknown
}

/**
 * 调用方注入的 Kernel（Taro 插件内核，由 @tarojs/service 提供）。
 * 未注入时：plugins 为空数组、platforms 为 [] 且 platformsStatus='degraded'。
 */
export interface KernelLike {
  initialConfig?: {
    plugins?: unknown
    presets?: unknown
    platforms?: unknown
    /** 源码目录名（相对工程根），决定 app.config 与页面文件定位根。默认 'src'。 */
    sourceRoot?: string
    /**
     * 路径别名 map。仅从此处派生；webpackChain / vite 定义 alias Kernel 亦不可得，
     * 触发 §4.4 alias 降级（unresolved + 缺失候选 + owner JSX analyzer partial）。
     */
    alias?: Record<string, unknown>
    [key: string]: unknown
  }
  plugins?: ReadonlyMap<string, KernelPluginEntry>
  hooks?: ReadonlyMap<string, KernelHookEntry[]>
  commands?: ReadonlyMap<string, KernelCommandEntry>
  platforms?: ReadonlyMap<string, KernelPlatformEntry>
  methods?: unknown
}

// =============================================================================
// CreateProjectGraph（P1 保留）
// =============================================================================

/** 创建项目图实例的入参。 */
export interface ICreateProjectGraphOptions {
  /** 项目根目录（含 app.config 的工程根）。 */
  root: string
  /** 可选注入的 Kernel；提供时启用 B 层插件/platforms 数据，否则空 + degraded。 */
  kernel?: KernelLike
}

/** 取消订阅句柄。 */
export type TUnsubscribe = () => void

/**
 * 图变更事件（dev-time）。判别联合（`ok` 判别）：
 *  - 成功（ok:true）：防抖全量重建成功、原子替换后触发；带本次变更文件与新 revision。
 *  - 失败（ok:false）：重建过程抛错（非降级空图，是真异常）——**保留旧快照**、发失败
 *    事件，不暴露半成品（§6）。消费方据此决定是否提示/重试，图仍是上一份可用快照。
 */
export type IGraphChange =
  | {
    ok: true
    /** 触发本次重建的变更文件路径（chokidar 侦测到的 add/change/unlink）。 */
    changedFiles: string[]
    /** 重建后新图的 revision（单调递增）。 */
    revision: number
  }
  | {
    ok: false
    /** 触发本次重建尝试的变更文件路径。 */
    changedFiles: string[]
    /** 失败原因（人类可读；不含修复建议）。 */
    error: string
  }

/** dev-time 图变更监听器。 */
export type TGraphChangeListener = (change: IGraphChange) => void

// =============================================================================
// getProjectGraph（P1 保留 · 重定义：精确版本约束 + 结构化错误）
// =============================================================================

/** getProjectGraph 可选项。 */
export interface IGetProjectGraphOptions {
  /**
   * 期望的 schemaVersion 字面量（§3.1 clean break，仅接受精确匹配）：
   *  - 省略：消费方不做版本断言，返回当前图。
   *  - 提供且与图 schemaVersion 不一致 → 抛 ISchemaVersionError（结构化错误）。
   */
  schemaVersion?: TSchemaVersion
}

/**
 * 结构化 schema 版本不符错误（§3.1 clean break：不提供 1.x 运行时转换器）。
 * 消费方可从该对象读取 expected / actual / message 做友好提示或自愈策略。
 * WP6b 决定具体 Error class 命名与序列化形状；本接口冻结字段面。
 */
export interface ISchemaVersionError extends Error {
  /** 消费方期望的版本（传入值，可能不存在 → undefined）。 */
  expected?: string
  /** 图实际版本。 */
  actual: string
  /** 人类可读提示。 */
  message: string
}

// =============================================================================
// §5.1 Query 选择器与通用参数（P2 新增）
// =============================================================================

/**
 * 组件选择器 —— Query 层统一的 target 形态（§5.1：Query 使用统一 ComponentSelector，
 * 结果始终携带 relation/edge、source location、目标身份与 resolution evidence）。
 * 三种选法互斥（实现 WP6a 决定冲突时的优先级）：
 *  - byId       : 按 ComponentNode.id（三类主键字符串）。
 *  - bySpecifier: 按原始 specifier / packageName / packageName+subpath（可能
 *                命中多个节点，如同时有 npm 与 external 身份）。
 *  - byFilePath : 按 local 组件的解析后真实文件路径（barrel 已穿透到最终定义
 *                文件；export 维度由 exportName 进一步过滤）。
 */
export type TComponentSelector =
  | { byId: string, exportName?: string }
  | { bySpecifier: string, exportName?: string }
  | { byFilePath: string, exportName?: string }

/** 关系 kind 过滤（usingComponent=config 声明 / componentUsage=JSX 实际使用）。 */
export type TRelationKind = 'usingComponent' | 'componentUsage'

/** direct / transitive 选择（§5.1 findComponentDependencies 主查询）。 */
export type TDependencyMode = 'direct' | 'transitive'

/**
 * 组件依赖查询通用选项。
 * transitive 仅沿 **local 组件**边展开（npm 为递归终点，浅纳入 §2.1）。
 */
export interface IFindComponentDependenciesOptions {
  /** direct（默认）/ transitive。 */
  mode?: TDependencyMode
  /** 仅沿这些 relation kind 展开；缺省为双 kind 并集（usingComponent ∪ componentUsage，与 §4.4 SCC 一致）。 */
  relationKinds?: TRelationKind[]
  /** 仅返回这些解析终态的引用（缺省全部）。 */
  resolutions?: TResolution[]
  /** transitive 专用：最大深度（缺省为实现自定；必须可证明收敛，P2 不承诺"无界递归"）。 */
  maxDepth?: number
  /** 返回条数上限（防爆炸，截断时携带 truncated=true）。 */
  limit?: number
}

/**
 * findComponentDependencies 返回。
 * 结果**稳定排序**（§5.2 Query 最小契约）—— WP6b 决定具体排序键，本契约只冻结稳定性要求。
 */
export interface IFindComponentDependenciesResult {
  /** 起始节点（选择器解析后命中的唯一 ComponentNode；选择器不唯一时抛错）。 */
  root: IComponentNode
  /** 命中的边。 */
  edges: IEdge[]
  /** 从 root 可达的 ComponentNode 集合（含 npm/external；unresolved 不建节点不入此集）。 */
  components: IComponentNode[]
  /** 是否被 limit 截断。 */
  truncated: boolean
}

/** findComponentReferenceAt 的位置参数。 */
export interface IPosition {
  /** 1-based。 */
  line: number
  /** 1-based。 */
  column: number
}

/** listComponentReferences 的过滤器（§5.1 unresolved/external/degraded 批量）。 */
export interface IListComponentReferencesFilter {
  /** 按 relation kind 过滤。 */
  relationKinds?: TRelationKind[]
  /** 按解析终态过滤（支撑 'unresolved' / 'external' 批量消费）。 */
  resolutions?: TResolution[]
  /** 按源节点类型过滤（app / page / component）。 */
  fromKinds?: Array<'app' | 'page' | 'component'>
  /** 按目标 ComponentNode.sourceKind 过滤。 */
  targetKinds?: TComponentSourceKind[]
  /** 只返回 degraded（owner analysisStatus≠complete）派生的引用，便于消费方做诊断聚合。 */
  degradedOnly?: boolean
  /** 返回条数上限。 */
  limit?: number
}

// =============================================================================
// IProjectGraphQuery —— 统一查询接口（§5.1 完整 API 面，I/T 改名）
// =============================================================================

export interface IProjectGraphQuery {
  /**
   * 【P1 保留 · 重定义】取完整图。
   *
   * @param opts.schemaVersion 期望版本（字面量 '2.0.0'）。省略不校验；提供且
   * 不匹配 → 抛 ISchemaVersionError（结构化错误，而非静默 undefined）。
   */
  getProjectGraph(opts?: IGetProjectGraphOptions): IProjectGraph

  // ---- 页面查询（P1 保留 · 改名） ----------------------------------------

  /** 按路由路径查页面（含前导 '/'，如 '/pages/index/index'）。 */
  findPageByRoute(routePath: string): IPageNode | undefined

  /** 按文件绝对路径查页面。 */
  findPageByFilePath(filePath: string): IPageNode | undefined

  /** 反查所有跳转到该页的 navigation 边。 */
  findReferencesToPage(pageId: TPageRef): INavigationEdge[]

  // ---- 平台 / 插件查询（P1 保留 · 改名；Kernel 期可信，OQ-016） -------------

  /** 编译目标平台名列表；未注入 Kernel 时返回 []（带病迁移）。 */
  getPlatforms(): string[]

  /** 插件清单（A/B 层；D 层 manifest 留位）。 */
  getPlugins(): IPluginNode[]

  /** 按 id 查插件（P2 id 重定义：packageName 或 packageName#包内相对路径；查找保留 suffix 兜底）。 */
  findPluginById(id: string): IPluginNode | undefined

  // ---- 订阅（P1 保留 · 改名） ---------------------------------------------

  /** dev-time 订阅图变更（防抖全量重建成功后原子替换并触发；失败发 ok:false 事件）。 */
  onGraphChange(listener: TGraphChangeListener): TUnsubscribe

  /**
   * 释放实例资源（§6 生命周期终点）：停止 watcher、清空所有订阅者。幂等——可重复
   * 调用。dispose 后再 onGraphChange 视为新订阅、会重新惰性启动 watch（实例仍可用，
   * 只是显式回收了当前监听资源）；宿主关闭前调用以确保不泄漏 chokidar 句柄。
   */
  dispose(): void

  // ---- 页面跳转辅助（P2 新增 · B61） --------------------------------------

  /**
   * 把 PageNode 的 filePath 渲染为 `file://绝对路径:1:1` 格式，供 VS Code 等
   * 终端 Cmd+点击打开（§2.1：PageNode.filePath 是 P1 迁移保留字段，本函数是
   * 对既有字段的纯投影，Query 层零新增数据源）。
   *
   * @throws 若 pageId 不指向任何 PageNode。
   */
  pageToFileUrl(pageId: TPageRef): string

  // ---- 组件依赖查询（P2 新增） ---------------------------------------------

  /**
   * 主查询：从某个组件出发查 direct/transitive 依赖。
   * transitive 仅沿 local 组件边展开（npm 为递归终点，浅纳入 §2.1）。
   * 结果始终携带 relation/edge、source location、目标身份与 resolution evidence。
   */
  findComponentDependencies(
    selector: TComponentSelector,
    opts?: IFindComponentDependenciesOptions
  ): IFindComponentDependenciesResult

  /**
   * config 专项便捷查询：列出在某个 config（app / page / component config）中
   * 声明的 usingComponents 边（含 app 级全局组件）。
   */
  findUsingComponents(
    owner: TNodeRef | { app: true } | { pageId: TPageRef } | { componentId: TComponentRef }
  ): IEdge[]

  /**
   * 反向引用查询：列出所有指向 selector 命中组件的边（usingComponent ∪
   * componentUsage；edge 是唯一事实源，不再有 ComponentNode.usedBy）。
   */
  findReferencesToComponent(selector: TComponentSelector): IEdge[]

  /**
   * 位置定位 / 跳转：在源文件某行列处命中的组件引用（IDE 红线 / Lens /
   * Definition 跳转的支撑）。
   *
   * @returns 命中的 IEdge；未命中返回 undefined。
   */
  findComponentReferenceAt(filePath: string, position: IPosition): IEdge | undefined

  /**
   * 通用批量消费：按 unresolved / external / degraded 等条件列出全部组件引用。
   * 用于 CLI lint、诊断聚合、mock capability catalog 等消费型投影。
   */
  listComponentReferences(filter?: IListComponentReferencesFilter): IEdge[]

  // ---- 轻量 envelope 投影（P2 新增 · §5.2 四通道共享底座） ----------------

  /**
   * 只取图的"诊断事实 + 覆盖度 + 版本/快照/上下文"轻量 envelope，
   * 供 CLI summary / JSON envelope / MCP summary 共用，避免重复扫 edges。
   */
  getGraphSummary(): {
    schemaVersion: TSchemaVersion
    snapshotId: string
    analysisContext: IAnalysisContext
    capabilities: ICapabilities
    issues: IGraphIssue[]
    counts: {
      pages: number
      components: number
      plugins: number
      navigationEdges: number
      usingComponentEdges: number
      componentUsageEdges: number
    }
  }
}

// =============================================================================
// CreateProjectGraph 工厂（P1 保留 · 实现见 graph.ts）
// =============================================================================

/**
 * 创建项目图实例。本文件仅声明签名；实现继续由 `./graph` 导出，避免契约与
 * 实现耦合（与 P1 分层一致）。
 */
export type CreateProjectGraph = (options: ICreateProjectGraphOptions) => IProjectGraphQuery
