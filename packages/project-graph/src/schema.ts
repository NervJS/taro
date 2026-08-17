/**
 * @tarojs/project-graph — Schema 2.0 契约稿（WP1 冻结，不实现）
 *
 * 契约依据：taro-meta `rfcs/0003-project-graph-p2-plan.md`（下称 P2 计划）。
 * 本文件仅冻结公共类型面（§3.2 P1→P2 迁移矩阵逐项落点），实现归 WP2+。
 *
 * =============================================================================
 * §3.1 Clean break
 * =============================================================================
 * Graph Schema 从 '1.0.0' clean-break 到 '2.0.0'：getProjectGraph 仅接受精确
 * 版本并在不匹配时抛结构化错误，不提供 1.x 运行时转换器。该例外建立在包仍
 * beta（4.1.12-beta.x）、无正式外部消费者的前提上；graph schemaVersion 与
 * npm package SemVer 是两条独立轴。本次 break 公开类型统一 I/T 命名：
 * interface 以 I 开头（IAppNode/IPageNode/IComponentNode/IEdge/IGraphIssue），
 * type alias 以 T 开头（TNodeRef/TResolution/TFrameworkKind/...）。
 *
 * =============================================================================
 * §3.2 P1→P2 迁移矩阵逐项落点（WP1 DoD #1 —— 每项登记去向与理由）
 * =============================================================================
 *
 * | P1 元素 | 去向 | 2.0 落点 |
 * |---|---|---|
 * | AppNode / AppConfig | 保留 · 改名 | IAppNode（新增 id/analysisStatus）/ IAppConfig。P2 允许从 AppNode 出发的 usingComponent/componentUsage 边（app 级 usingComponents / 全局组件），覆盖度挂 IAppNode.configAnalyzerStatus。 |
 * | PageNode（含 routePath/config/inSubpackage） | 保留 · 改名 | IPageNode。usingComponents 内联字段**删除**→迁 IUsingComponentEdge。framework 子字段随 AnalysisContext 六值判定（单项目单 context，与 IProjectGraph.framework 顶字段取值一致），修正 P1 恒 'react' 缺陷。 |
 * | PageNode.compileModeStatus（P1 仅留位） | 保留留位 | IPageNode.compileModeStatus?: string。值域与产出机制待 RFC-0004 Build Diagnostic Stream 协调（RFC-0003 §8 开放问题 5），P2 不实现。 |
 * | PageNode.propsType / exports（P1 留位） | 保留留位 | P3 字段，P2 不实现，沿用 optional 留位不收窄。 |
 * | Navigation edge | 保留 · 改名 | IEdge 联合中的 INavigationEdge；IEdge.resolved 保留（悬空跳转诊断信号，承接 P1 warnings.kind='broken_navigation' 的语义）。 |
 * | ProjectGraph.warnings / GraphWarning / GraphWarningKind（pilot 消费） | 保留 · 重定义 | 迁为 IGraphIssue / IProjectGraph.issues（§3.4）。kind 重映射：config_parse_failed→'parse-failed'；broken_navigation→INavigationEdge.resolved=false（不再产 issue，空路由特化场景由 'empty-route' 表达）；unresolved→IComponentEdge.resolution ∈ {external, unresolved}（在 edge 上体现）。P2 新增 'empty-route'。warnings 字段**删除**，消费方改读 issues——pilot 适配属 P2 范围外。 |
 * | ProjectGraph.framework（P1 恒 'react'，C.6.4 缺陷） | 保留 · 重定义 | TFrameworkKind 六值判定（react/preact/solid/vue3/none/unknown），取值见 §4.1 AnalysisContext。无 Kernel 且静态推断失败取 'unknown'，不得回退 'none'/'react'。 |
 * | ProjectGraph.schemaVersion | 保留 · 改值 | '1.0.0'→'2.0.0'，字面量类型锁定。 |
 * | ProjectGraph.platforms | 保留 · 带病迁移 | IProjectGraph.platforms: string[]（平台名清单）。无 Kernel 时 [] 且 platformsStatus='degraded'，不伪造（OQ-016 带病迁移，根治非 P2）。 |
 * | ComponentNode.usedBy（P1 schema 留位但从未实现） | 删除 | 反向关系由 Query 派生（findReferencesToComponent），edge 是唯一事实源（§3.4）。 |
 * | PluginNode A/B 层字段 | 保留 · 改修 | IPluginNode。id 规则重定义修复同包多插件文件 id 碰撞：id = packageName（包内单插件文件）或 packageName + '#' + 包内相对路径（同包多插件文件）；包名 resolve 失败时保持 P1 行为退化为解析后绝对路径（findPluginById 的包名查询有 suffix 兜底）。 |
 * | PluginNode D 层 manifest（P1 仅留位） | 保留留位 | IPluginNode.manifest?: unknown。规范归属待定（RFC-0009 / RFC-0001 §6.4），P2 不实现。 |
 * | PROJECT_GRAPH_KERNEL_KEY = '__projectGraph' | 保留不变 | taro-plugin.ts 已持有该字面量（pilot 契约），WP1 不迁移、不改 key。 |
 * | output 落盘 .taro/project-graph.json | 保留 · 扩字段 | 结构随 Schema 2.0 envelope 更新（§5.2：snapshotId/analysisContext/capabilities/graph/issues），消费方读快照路径不变。 |
 * | P1 Query 全部 | 保留 · 改名 | 见 query.ts（IProjectGraphQuery，§5.1 完整 API 面 13 项）。 |
 * | P1 公开类型别名（NodeRef/PageRef 等） | 保留 · 改名 | TNodeRef/TPageRef/TComponentRef。 |
 * | 包根 / ./mcp / ./taro-plugin 导出；双 CLI 形态 | 保留 | 子导出机制不变，本契约稿不触及。 |
 * | Kernel 注入行为（sourceRoot/alias 派生、无 Kernel 降级） | 保留 | IAnalysisContext 记录最终值 + 来源；alias 降级契约见 §4.4（webpackChain-only alias 不可得→unresolved·缺失候选·owner partial，不静默丢不伪造）。 |
 *
 * =============================================================================
 * §3.3 稳定身份（三类主键 + safeId；WP1 冻结实现规则，见 TSafeId 注释）
 * =============================================================================
 * 组件身份按 §4.4 判定树终态分三类：
 *  - local    : `${resolvedRealpath}#${exportName}`（解析后真实文件路径 + 导出符号名；
 *               barrel/re-export 必须穿透到最终定义文件；平台后缀归一取当前 platform
 *               解析出的文件，跨 platform context 下 id 会变——单 platform 分析 +
 *               context fingerprint 含 platform，功能无误）
 *  - npm      : `${packageName}${subpath ? '/'+subpath : ''}#${exportName}`；
 *               package 无子路径时可省略 '#exportName' 前的 subpath 同时 exportName
 *               为 'default'。**不用 realpath**（pnpm 软链的 realpath 落 .pnpm 深层
 *               且不稳定）。
 *  - external : 原始 specifier `as-is`（无本地文件、无 realpath；plugin:// 直接判
 *               external）。
 *
 * 已知假阳性/迁移性（设计接受、非静默失败，穷举自 §3.3，消费方须知）：
 *  ① config 无法静态证明唯一默认导出时，config 边与 JSX 默认导入边可能落不同节点
 *     （filePath 兜底 key vs `realpath#default`，因不穿透/穿透差异）；
 *  ② 同一 workspace 自研包被裸包名（npm 键；未安装→external 键）与 alias/相对
 *     路径（local 键）混合引用时，同一文件落两节点；
 *  ③ 身份随安装态迁移：未安装 external 键 → 安装后 npm 键，node id 会变，由包/
 *     锁文件变化触发的防抖全量重建吸收——消费方不得假设跨安装态 id 稳定。
 * 常规写法（统一包名或统一路径 + 默认导出约定）下均不触发。
 */

// =============================================================================
// 版本常量
// =============================================================================

/** 当前 schema 版本（clean break 后锁定字面量）。 */
export const SCHEMA_VERSION = '2.0.0' as const

/** getProjectGraph 的合法版本约束类型；仅接受精确匹配（§3.1）。 */
export type TSchemaVersion = typeof SCHEMA_VERSION

// =============================================================================
// §4.1 Framework 与平台标识
// =============================================================================

/**
 * 框架六值（§4.1）。
 *  - react / preact / solid / vue3：真实识别值（配置、package.json 依赖、源码特征）。
 *  - none   ：确为无框架 / dynamic 原生工程。
 *  - unknown：无 Kernel 且静态配置推断亦失败时的降级默认——**不得回退到 none 或 react**。
 * native 是 source/platform 维度，不是 framework（native source 只是平台差异）。
 */
export type TFrameworkKind = 'react' | 'preact' | 'solid' | 'vue3' | 'none' | 'unknown'

// =============================================================================
// §4.1 AnalysisContext（单项目单实例；最终值 + 来源标注，WP1 冻结）
// =============================================================================

/**
 * 取值来源（§4.1 优先级：显式 options > 注入 Kernel > 项目静态配置 > 降级默认）。
 */
export type TContextSource = 'options' | 'kernel' | 'static-config' | 'default'

/**
 * 分析上下文 —— 全部 Analyzer / Resolver / fingerprint 的唯一上下文来源。
 * 单项目单实例；fingerprint 由实现从最终值派生（framework + platform + sourceRoot
 * + alias 确定性序列化）并进入缓存（P2 计划 §6）。平台/插件事实只在有 Kernel 时
 * 可信：静态配置可作 framework/sourceRoot/alias 推断来源，但**不得**作为
 * platforms/plugins 的来源（§10 继承项 OQ-016）。
 */
export interface IAnalysisContext {
  /** 六值框架判定（§4.1）。无 Kernel 且静态推断失败取 'unknown'。 */
  framework: TFrameworkKind
  frameworkSource: TContextSource
  /**
   * 目标平台单值（如 'weapp'/'h5'/...），等价 Kernel 的 TARO_ENV。
   * 仅 Kernel 注入时可信；无 Kernel（纯 CLI）为 undefined。
   */
  platform?: string
  platformSource: TContextSource
  /** 源码根目录绝对路径（join(root, sourceRoot 目录名)，默认 'src'）。 */
  sourceRoot: string
  sourceRootSource: TContextSource
  /**
   * 路径别名。alias 仅来自 kernel.initialConfig.alias：纯 CLI 无 Kernel、或
   * alias 写在 webpackChain / vite 配置里（Kernel 亦不可得）时为空 {}，alias 引用
   * 按 §4.4 降级为 unresolved + 缺失候选 + owner JSX analyzer 标 partial。
   */
  alias: Record<string, unknown>
  aliasSource: TContextSource
}

// =============================================================================
// §3.3 稳定身份原语 —— 主键与 safeId（WP1 冻结规则）
// =============================================================================

/**
 * 节点 id 的安全形式。三类主键串（realpath#export / pkg#export / specifier）可能
 * 极长（pnpm .pnpm 深层 realpath），实现层（WP3）按固定规则截断并拼稳定 hash 后缀：
 *   - hash 算法：sha256（Node 标准 crypto），取前 8 hex；
 *   - 长度上限 128 chars：id 超长 → `${head…}…${tail}:${hash8}`；
 *   - 输入主键串是 hash 与截断的唯一数据源，不引入时间戳/随机数；
 *   - 字符不做 lowercase（磁盘路径保留真实大小写）；
 *   - 稳定排序依赖 id 字典序，截断后仍保证可比。
 */
export type TSafeId = string

// =============================================================================
// §3.4 analysisStatus / capabilities / issues（唯一真相归属）
// =============================================================================

/**
 * 单 analyzer 在单节点上的覆盖度状态（§3.4）。
 *  - complete：已分析且完整。
 *  - partial ：工具限制类 unresolved（无 Kernel 拿不到 alias/platform；import * as X
 *              无法静态确定具体 export；config span 定位失败；无 platform 时后缀-only
 *              组件未解析）——**仅这类**降 owner 覆盖度。
 *  - failed  ：parse 失败，未采集。
 * 事实性 missing（拼错路径→unresolved、未安装裸包→external）只在 edge 上体现，
 * 不降本状态——避免一个可选依赖漏装让全局 JSX 误报 degraded。
 */
export type TAnalysisStatus = 'complete' | 'partial' | 'failed'

/** 单 analyzer 覆盖态标签（§3.4 两套来源）；判别联合 ICapabilityEntry 的 `status` 取值域。 */
export type TCapabilityStatus = 'supported' | 'degraded' | 'unsupported'

/** unsupported 静态 reason code（framework × analyzer 静态表，§3.4）。 */
export type TUnsupportedReason = 'not-applicable' | 'deferred'

/** 单 analyzer 的 capability 条目（两套来源：supported/degraded 聚合自节点级 analysisStatus；unsupported 静态判定）。 */
/**
 * 单个 analyzer 的覆盖度条目（§3.4 两套来源，判别联合——`status` 为判别标签）：
 *  - supported   ：全节点该 analyzer complete；无附加字段。
 *  - degraded    ：聚合自节点 analysisStatus，携带 failedCount/total。
 *  - unsupported ：framework×analyzer 静态判定，携带 reason；不参与聚合、无对应节点/issue。
 * 判别联合确保非法组合（如 supported 却带 reason、degraded 却带 reason）在类型层即被拒。
 */
export type ICapabilityEntry =
  | { status: 'supported' }
  | { status: 'degraded', failedCount: number, total: number }
  | { status: 'unsupported', reason: TUnsupportedReason }

/**
 * 顶层 capabilities（§3.4）：
 *  - configAnalyzer  ：对 framework 六值全部 supported/degraded（无 unsupported）。
 *  - jsxAnalyzer      ：React/Preact/Solid 参与聚合；vue3='deferred' unsupported
 *                       （概念适用但 P2 不采 Vue3 JSX render function）；none=
 *                       'not-applicable'；unknown 暂记 'not-applicable'（§12② 待收口）。
 *  - templateAnalyzer ：React/Preact/Solid/none/unknown='not-applicable' ；
 *                       vue3='deferred'（Vue3 template 概念适用但本期不做）。
 * 一致性不变式（仅 supported/degraded 那套）：节点 analysisStatus ↔ capabilities
 * 聚合值 ↔ 'analysis-incomplete' GraphIssue 三者同源派生。
 */
export interface ICapabilities {
  configAnalyzer: ICapabilityEntry
  jsxAnalyzer: ICapabilityEntry
  templateAnalyzer: ICapabilityEntry
}

// =============================================================================
// Config / 节点类型（I 前缀）
// =============================================================================

/** 标准化的 app.config 解析结果（@tarojs/helper readConfig 决定形状，此处不收窄）。 */
export type IAppConfig = Record<string, unknown>

/** 标准化的 page.config 解析结果。 */
export type IPageConfig = Record<string, unknown>

/** 标准化的 component config（不同框架下字段集不同，此处不收窄）。 */
export type IComponentConfig = Record<string, unknown>

/** 节点引用（图内某个节点 id）。 */
export type TNodeRef = string
/** 页面节点引用（IPageNode.id；INavigationEdge 悬空跳转时指向不存在 id）。 */
export type TPageRef = string
/** 组件节点引用（IComponentNode.id）。 */
export type TComponentRef = string

/**
 * app.config.ts 对应的应用节点，全图唯一。
 * P1 AppNode 未带 id（顶层消费者直接引用 graph.app），P2 引入 IAppNode.id 作为
 * 边端点稳定引用（App→Page 的 navigation、App→Component 的双关系边的 from 端）。
 */
export interface IAppNode {
  /** 应用节点 id（固定值 'app'，图内唯一）。 */
  id: string
  filePath: string
  config: IAppConfig
  /**
   * 各 analyzer 的覆盖度。app 级 usingComponents / 全局组件的覆盖度挂此处的
   * configAnalyzerStatus（§3.4：app 级 fact 的 owner 是 AppNode 自身）。
   */
  configAnalyzerStatus: TAnalysisStatus
  jsxAnalyzerStatus: TAnalysisStatus
}

/**
 * 页面节点（路由事实 + 页面 config 事实载体）。
 *
 * §3.2 PageNode.framework 子字段随 AnalysisContext 六值判定（单项目单 context，
 * 与 IProjectGraph.framework 顶字段取值一致），修正 P1 恒 'react' 缺陷。
 */
export interface IPageNode {
  /** routePath 派生的页面 id（P1 相同规则）。 */
  id: string
  /** 路由路径（含前导 '/'）。 */
  routePath: string
  /** 页面入口源文件绝对路径（P2 该字段被 pageToFileUrl 消费，渲染 file://:1:1）。 */
  filePath: string
  configFilePath: string
  config: IPageConfig
  /** 六值框架（AnalysisContext 判定；不再 P1 恒 'react'）。 */
  framework: TFrameworkKind
  inSubpackage?: string
  /** 页面 config analyzer 覆盖度。 */
  configAnalyzerStatus: TAnalysisStatus
  /** 页面 JSX analyzer 覆盖度（§4.4：后缀-only / alias 缺失 / import * as X）。 */
  jsxAnalyzerStatus: TAnalysisStatus
  /** 留位（值域/产出机制待定 RFC-0004），P2 不实现。 */
  compileModeStatus?: string
  /** P3 留位，P2 不实现。 */
  propsType?: unknown
  /** P3 留位，P2 不实现。 */
  exports?: Record<string, unknown>
}

/**
 * 组件节点 —— P2 新增，表达一次解析命中的逻辑组件。
 * ComponentNode 表达逻辑组件身份；edge 表达某次具体引用及证据（§1.4 / §2.1）。
 */
export interface IComponentNode {
  /** 三类主键之一：local `${realpath}#${exportName}` / npm `${pkg}[/${sub}]#${export}` / external 原始 specifier；TSafeId 截断后字符串。 */
  id: string
  /** 主键类别（§3.3 / §4.4 判定树）。 */
  sourceKind: TComponentSourceKind
  /** local / npm 解析后真实文件绝对路径；external 为 undefined（无本地文件）。 */
  resolvedFilePath?: string
  /** npm 包名（含 scope）。sourceKind='npm' 时必填，其余缺省。 */
  packageName?: string
  /** npm 子路径（'@myorg/ui/a' 中的 'a'）；主入口缺省。 */
  packageSubpath?: string
  /** 导出符号名：'default' 或 named export。external 可能缺省（specifier 即整体身份）。 */
  exportName?: string
  /** npm/external 不读 config（浅纳入，npm 为递归终点），仅 sourceKind='local' 时可能非空。 */
  configFilePath?: string
  /** 仅 local 时存在（P2 不递归 npm 的 config / 子依赖）。 */
  config?: IComponentConfig
  /** 覆盖度：仅 local 节点有意义；npm/external 恒 'complete'（无挖掘空间，浅纳入终态语义）。 */
  configAnalyzerStatus: TAnalysisStatus
  jsxAnalyzerStatus: TAnalysisStatus
}

/** IComponentNode.sourceKind 值域（§4.4 四终态在 node 侧的投影；unresolved 不建节点）。 */
export type TComponentSourceKind = 'local' | 'npm' | 'external'

/** 插件注册的 CLI 命令。 */
export interface IPluginCommand {
  name: string
  alias?: string
  optionsMap?: Record<string, string>
  synopsisList?: string[]
}

/**
 * 插件节点（A/B 层字段数据源为注入 Kernel，见 P1 同名词条注释；D 层 manifest 留位）。
 * P2 修 id 碰撞：id = packageName 或 packageName + '#' + 包内相对路径（同包多插件
 * 文件场景）；resolve 失败退化为解析后绝对路径。
 */
export interface IPluginNode {
  /** 见上方 id 规则（P2 重定义，修 P1 C.6.4 缺陷#3）。 */
  id: string
  opts?: unknown
  registeredHooks?: string[]
  commands?: IPluginCommand[]
  platforms?: string[]
  manifest?: unknown
}

// =============================================================================
// §3.4 边（IEdge 联合：navigation / usingComponent / componentUsage）
// =============================================================================

/** 页面跳转方式。 */
export type TNavigationVia = 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | 'useRouter'

/** P1 保留的 navigation 边：App/Page → Page。 */
export interface INavigationEdge {
  kind: 'navigation'
  from: TNodeRef
  to: TPageRef
  via: TNavigationVia
  /** 悬空跳转诊断信号（承接 P1 warnings.kind='broken_navigation' 语义），未判定时省略。 */
  resolved?: boolean
}

/** §4.4 判定树互斥完备的四终态（edge 唯一事实源）。 */
export type TResolution = 'local' | 'npm' | 'external' | 'unresolved'

/** 组件引用边（usingComponent / componentUsage 两 kind）共享的 evidential 字段。 */
export interface IComponentEdgeBase {
  kind: 'usingComponent' | 'componentUsage'
  /** 引用方（AppNode / PageNode / ComponentNode 的 id）。 */
  from: TNodeRef
  /**
   * 被引用方 ComponentNode 的 id。
   * **resolution='unresolved' 时缺省**（§3.3：unresolved 只保留 edge、不创建虚假节点，
   * 亦无从算出 local/npm/external 主键）——实现**不得**臆造 sentinel id，否则消费方
   * 可能读到与真节点碰撞的幻影 id。此时**消费面**的被引用方线索只有 `rawSpecifier`；
   * "缺失候选路径"不在 edge 上、属 InputManifest 内部诊断产物（§6，供 cache/watch 判定失效），
   * 非消费面字段。resolution ∈ {local,npm,external} 时 `to` 必给。
   */
  to?: TComponentRef
  /** 解析终态（§4.4 四终态；本字段是 edge 状态的唯一事实源）。 */
  resolution: TResolution
  /** 原始 specifier、原样保留（external 身份 + 追溯 + unresolved 候选定位的信息源）。 */
  rawSpecifier: string
  /** usingComponents key 或 import binding local name（使用方本地符号）。 */
  localName?: string
  /** 数组形式 `[path, opts]` 的 opts（对齐主仓 `value[0]` 语义），仅 config usingComponents 场景。 */
  usingOptions?: unknown
  /** config / 源码内位置证据。 */
  sourceSpan?: ISourceSpan
}

/**
 * config 声明关系：使用方在 app/page/component config 的 `usingComponents`
 * （含 app 级全局组件）里显式声明路由到该组件。
 */
export interface IUsingComponentEdge extends IComponentEdgeBase {
  kind: 'usingComponent'
}

/** 源码实际使用关系：JSX 标签 / render function 中显式消费。 */
export interface IComponentUsageEdge extends IComponentEdgeBase {
  kind: 'componentUsage'
}

/** 图边联合（Schema 2.0）。 */
export type IEdge = INavigationEdge | IUsingComponentEdge | IComponentUsageEdge

/**
 * 源码位置证据。
 * sourceSpan 定位失败时（config 经 esbuild 求值后缺 AST span）保留 filePath 级证据
 * 并把该节点对应 analyzer 标 partial（§4.2），不得伪造精确位置。
 */
export interface ISourceSpan {
  filePath: string
  /** 1-based；不可得时缺省（filePath 级证据），不得伪造 0/1。 */
  startLine?: number
  startColumn?: number
  endLine?: number
  endColumn?: number
}

// =============================================================================
// §3.4 GraphIssue（诊断信号；结构事实暴露，不产 severity/confidence/修复）
// =============================================================================

/**
 * 诊断事实 kind（§3.4 枚举，唯一出处）。
 *  - parse-failed        : **单点**：某文件解析失败（含 P1 warnings.kind='config_parse_failed' 重映射）。
 *  - analysis-incomplete : **图级汇总**：存在 ≥1 个 parse-failed/partial 节点时产一条（非每节点重复计）。
 *  - cycle               : SCC cycle（local 组件间 resolved 双类边并集，Tarjan/Kosaraju 稳定序）。
 *  - empty-route         : **P2 新增**（B59）：config 声明了 routePath（**触发源三处**：`app.config` 的 `pages[]`、`subPackages[].pages[]`、`tabBar.list[].pagePath`）但对应 PageNode 不存在（文件缺失或解析失败）——broken_navigation 的特化，给消费方（IDE 红线 / CLI 列表）更直接的诊断分类，仅作结构化事实暴露。
 */
export type TGraphIssueKind = 'parse-failed' | 'analysis-incomplete' | 'cycle' | 'empty-route'

/** 图构建过程产生的诊断事实（唯一来源；severity/confidence/fix/nextActions 留在消费层，不进 Schema）。 */
export interface IGraphIssue {
  kind: TGraphIssueKind
  /** 人类可读描述（不含修复建议）。 */
  message: string
  /** 相关文件（parse-failed 与 empty-route 对应 config；cycle 为最先稳定排序命中的成员文件）。 */
  filePath?: string
  /** 相关节点（kind='parse-failed' 时指向 analyzerStatus 受影响节点；empty-route 时为 undefined——PageNode 不存在正是该 issue 的事实）。 */
  nodeId?: string
  /** empty-route 特有：config 声明的 routePath 字符串。 */
  routePath?: string
  /** cycle 特有：SCC 成员 component node id 列表（稳定排序）。 */
  sccMembers?: string[]
}

// =============================================================================
// §3.2 / §5.2 顶层 ProjectGraph
// =============================================================================

/** 统一项目结构图（Schema 2.0）。 */
export interface IProjectGraph {
  schemaVersion: TSchemaVersion
  /** 六值框架判定（§4.1；不再 P1 恒 'react'）。 */
  framework: TFrameworkKind
  /** 编译目标平台；Kernel 注入期可信；未注入时 []（带病迁移 OQ-016）。 */
  platforms: string[]
  /** platforms 字段的覆盖度状态：'complete'（来自 Kernel）/'degraded'（无 Kernel 空数组）—— 让消费方区分"确实无平台"与"拿不到"。 */
  platformsStatus: 'complete' | 'degraded'
  app: IAppNode
  pages: IPageNode[]
  /** P2 新增组件层（含 npm/external 节点；unresolved 不建节点）。 */
  components: IComponentNode[]
  /** 插件节点（数据源 Kernel；无 Kernel 为空数组）。 */
  plugins: IPluginNode[]
  /** 三类边联合；edge 是组件关系的唯一事实源。 */
  edges: IEdge[]
  /**
   * 图级覆盖度事实（§3.4 唯一真相归属）—— 跨节点 capabilities 聚合 + 静态
   * unsupported 判定表两组来源的叠加产物，消费方不再自行扫节点。
   */
  capabilities: ICapabilities
  /** 结构化诊断事实（P1 warnings 重定义，见 §3.2 行 6）。 */
  issues: IGraphIssue[]
  /** 快照 id（防抖全量重建成功后原子替换并递增，§6 watch/lifecycle）。 */
  snapshotId: string
  /**
   * 单调递增修订号（§6）：首次构建为 1，每次**成功**全量重建 +1。snapshotId 由输入
   * 内容 hash 派生（内容相同则不变），revision 则严格递增——消费方用它判定"图确实换过
   * 一代"（即便两代内容 hash 巧合相同），并可比较新旧。失败重建不递增（保留旧快照）。
   */
  revision: number
  /** 分析上下文（含来源标注；fingerprint 由此派生入缓存）。 */
  analysisContext: IAnalysisContext
}
