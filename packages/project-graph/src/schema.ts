/**
 * @tarojs/project-graph — schema
 *
 * P1 分层 schema（对齐落地方案 §2.3）。设计边界（§1.3）：
 *  1. 依赖方向单向：project-graph → @tarojs/helper，不依赖 @jdtaro/* 或 taro-pilot。
 *  2. 不为消费方特化：只产出本分层 schema，消费方自行适配。
 *  3. 核心库只含查询层：CLI / MCP 是独立入口包，此处不含。
 *  4. 不重复造底层能力：config 解析复用 @tarojs/helper。
 *
 * P1 仅 React（OQ-002）。后续阶段字段声明为 optional 但不实现。
 */

/** 标准化的 app.config 解析结果（形状由 @tarojs/helper readConfig 决定，此处不收窄）。 */
export type AppConfig = Record<string, unknown>

/** 标准化的 page.config 解析结果。 */
export type PageConfig = Record<string, unknown>

/** 节点引用：P1 用节点 id 字符串标识来源/目标。 */
export type NodeRef = string

/** 页面节点引用。通常是某个 PageNode.id；当边为悬空跳转（resolved:false）时，指向一个不存在的目标 id。 */
export type PageRef = string

/** app.config.ts 对应的应用节点，全图唯一。 */
export interface AppNode {
  filePath: string
  config: AppConfig
}

/**
 * 页面节点。P1 字段为前 7 项（id / routePath / filePath / configFilePath /
 * config / framework / inSubpackage?）。
 *
 * RFC-0003 §3.1 将 usingComponents、compileModeStatus 等列为必填，但其数据源
 * 属后续阶段，P1 无法构造，故降为 optional 留位、P1 不实现。
 */
export interface PageNode {
  id: string
  routePath: string
  filePath: string
  configFilePath: string
  config: PageConfig
  framework: 'react'
  inSubpackage?: string
  // 后续阶段字段（optional 留位，P1 不实现）：
  usingComponents?: Record<string, unknown> // P2
  propsType?: unknown // P3
  exports?: Record<string, unknown> // P3
  compileModeStatus?: string // 待定（RFC-0004 回流，值域未定，先不收窄）
}

/**
 * 插件节点。
 *  - id / opts 来自 A 层（静态读 config.plugins）。
 *  - registeredHooks / commands / platforms 来自 B 层（注入 Kernel 后填充），
 *    未注入时为空。
 *  - manifest 是 D 层能力声明入口，规范与 schema 待专项 RFC 定义，P1 仅留位。
 */
export interface PluginNode {
  /** 插件包名，如 '@tarojs/plugin-http'。与 Kernel 注册表按解析后绝对路径 join。 */
  id: string
  /** 用户传入的插件参数（= 插件专属配置）；函数形态 opts 静态不可得。 */
  opts?: unknown
  /** 注册的生命周期 hook 名，如 ['modifyAppConfig']。 */
  registeredHooks?: string[]
  /** 注册的 CLI 命令。 */
  commands?: PluginCommand[]
  /** 注册的编译平台。 */
  platforms?: string[]
  /** 能力声明（D 层）：规范内容待专项 RFC 立项定义，P1 仅留此入口、不实现。 */
  manifest?: unknown
}

/** 插件注册的 CLI 命令（含参数表与用法示例）。 */
export interface PluginCommand {
  name: string
  alias?: string
  /** 命令参数表。 */
  optionsMap?: Record<string, string>
  /** 用法示例。 */
  synopsisList?: string[]
}

/** 页面跳转方式。 */
export type NavigationVia =
  | 'navigateTo'
  | 'redirectTo'
  | 'switchTab'
  | 'reLaunch'
  | 'useRouter'

/**
 * 图的边。P1 仅 navigation 一种；usingComponent / import / typeFlow 后续阶段预留。
 *
 * resolved 标记 to 是否命中真实存在的 PageNode：false 表示悬空跳转（跳向不存在
 * 的页面），是构建诊断的关键信号，供 taro-pilot 等消费方使用。未判定时可省略。
 */
export type Edge = {
  kind: 'navigation'
  from: NodeRef
  to: PageRef
  via: NavigationVia
  resolved?: boolean
}

/** 诊断告警的类型。 */
export type GraphWarningKind =
  | 'config_parse_failed' // config 文件解析失败（如 readPageConfig 静默返回空）
  | 'broken_navigation' // 跳转目标页面不存在
  | 'unresolved' // 其它未能解析的引用

/**
 * 图构建过程中产生的诊断告警。
 *
 * 用途：避免"解析失败的空配置被误判为合法页面"这类静默错误，并把悬空跳转等
 * 问题作为结构化信号暴露给消费方（首个消费方 taro-pilot 做构建失败诊断）。
 */
export interface GraphWarning {
  kind: GraphWarningKind
  /** 人类可读的告警信息。 */
  message: string
  /** 相关文件路径（如有）。 */
  filePath?: string
  /** 相关节点 id（如有）。 */
  nodeId?: string
}

/** 统一项目结构图（P1）。 */
export interface ProjectGraph {
  schemaVersion: '1.0.0'
  /** OQ-003：统一字段，为多框架留位；P1 仅 react。 */
  framework: 'react'
  /** 项目编译目标平台；来自注入 Kernel，随任务 3 填充；未注入时为 []。 */
  platforms: string[]
  app: AppNode
  pages: PageNode[]
  /** 插件节点（A/B 层）。 */
  plugins: PluginNode[]
  /** P1 仅 navigation 边。 */
  edges: Edge[]
  /** 图构建过程中的诊断告警（解析失败、悬空跳转等）；无告警时为 []。 */
  warnings: GraphWarning[]
  // components / routes / subpackages / entries 为后续阶段预留
}

/** 当前 schema 版本。 */
export const SCHEMA_VERSION = '1.0.0' as const
