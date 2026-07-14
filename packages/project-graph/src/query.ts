/**
 * @tarojs/project-graph — 查询 API 与创建入口（契约冻结，对齐落地方案 §2.4 / §2.6）
 *
 * 遵循 RFC-0001 §4 设计原则：只产出结构化 JSON、不产出 prompt；消费方走稳定
 * API、不直接访问内部数据结构；schema 遵循 SemVer。
 *
 * 任务 0 仅冻结类型与函数签名（createProjectGraph 为占位实现，调用即抛错）。解析与
 * 查询实现由任务 2（页面/边/查询）与任务 3（插件/platforms）完成。冻结面包含工厂函数
 * createProjectGraph 与其返回的 ProjectGraphQuery 接口，消费方据此即可 import 类型并
 * 基于 mock 编译调用代码。
 */

import type { Edge, PageNode, PluginNode, ProjectGraph } from './schema'

/**
 * 调用方注入的 Kernel（Taro 插件内核，由 @tarojs/service 提供）。
 *
 * 本库不 `new Kernel`、不硬依赖 @tarojs/service（§1.3 边界 1、§2.6）：此处以
 * 结构最小化的鸭子类型接收调用方（如 taro-pilot）已持有的 Kernel 实例，用于
 * 填充插件节点的 B 层数据与顶层 platforms。未注入时 plugins 仅含 A 层、
 * platforms 为 []。字段形状按需在任务 3 收窄，任务 0 先留最小占位。
 */
export interface KernelLike {
  plugins?: unknown
  hooks?: unknown
  commands?: unknown
  platforms?: unknown
  methods?: unknown
}

/** 创建项目图实例的入参。 */
export interface CreateProjectGraphOptions {
  /** 项目根目录（含 app.config 的工程根）。 */
  root: string
  /**
   * 可选注入的 Kernel。提供时启用插件 B 层数据与 platforms；
   * 不提供时插件仅含 A 层静态信息、getPlatforms() 返回 []。
   */
  kernel?: KernelLike
}

/** 取消订阅句柄。 */
export type Unsubscribe = () => void

/** 图变更事件（dev-time）。 */
export interface GraphChange {
  /** 受影响并已重算的节点 id 列表。 */
  changed: string[]
}

/** dev-time 图变更监听器。 */
export type GraphChangeListener = (change: GraphChange) => void

/** getProjectGraph 可选项。 */
export interface GetProjectGraphOptions {
  /** 期望的 schemaVersion，用于消费方做版本对齐。 */
  schemaVersion?: string
}

/**
 * 统一查询接口。这是本库对外的唯一契约面；四通道（CLI / JSON / IDE / MCP）
 * 都是它之上的薄封装。
 */
export interface ProjectGraphQuery {
  /** 取完整图。 */
  getProjectGraph(opts?: GetProjectGraphOptions): ProjectGraph
  /** 按路由路径查页面。 */
  findPageByRoute(routePath: string): PageNode | undefined
  /** 按文件路径查页面。 */
  findPageByFilePath(filePath: string): PageNode | undefined
  /** 反查所有跳转到该页的 navigation 边。 */
  findReferencesToPage(pageId: string): Edge[]
  /** 插件清单。 */
  getPlugins(): PluginNode[]
  /** 按 id 查插件。 */
  findPluginById(id: string): PluginNode | undefined
  /** 编译目标平台；未注入 Kernel 时返回 []。 */
  getPlatforms(): string[]
  /** dev-time 订阅图变更。 */
  onGraphChange(listener: GraphChangeListener): Unsubscribe
}

/**
 * 创建一个项目图实例。这是本库的唯一创建入口。
 *
 * root 指定工程根；可选 kernel 用于启用插件 B 层数据与 platforms（§2.6）。
 * 返回的实例暴露 ProjectGraphQuery 全部查询方法。
 *
 * 任务 0 仅冻结签名，实现见任务 2 / 任务 3；此处为占位实现，调用即抛错，
 * 以保证编译产物中真实存在该导出、且未实现时能明确失败而非静默返回 undefined。
 */
export function createProjectGraph(
  _options: CreateProjectGraphOptions,
): ProjectGraphQuery {
  throw new Error(
    '[@tarojs/project-graph] createProjectGraph 尚未实现（任务 0 仅冻结契约，实现见任务 2 / 3）',
  )
}

