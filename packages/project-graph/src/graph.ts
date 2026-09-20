/**
 * @tarojs/project-graph — 图构建与查询实现（任务 2 / 3 / 5）
 *
 * 组装 config 解析（任务 1）+ 页面解析（任务 2）+ 插件解析（任务 3）为完整
 * ProjectGraph，并实现 createProjectGraph 工厂与查询函数。插件节点与 platforms
 * 仅在注入 Kernel 时填充（§2.6）。持久化缓存与 dev-time 监听增量见任务 5
 * （cache.ts / watch.ts）。
 */

import * as path from 'node:path'

import { buildFingerprint, collectPackageInputs, computeManifestHash, readCache, writeCache } from './cache'
import { buildConfigComponentGraph } from './config-graph'
import { parseAppConfig, readPageConfigContent, resolvePageConfigPath, resolvePageFilePath } from './config-parser'
import { jsxParticipatesIn, resolveFramework } from './framework'
import { buildJsxComponentGraph } from './jsx-graph'
import { buildNavigationEdges, parsePageFile, urlToRouteId } from './page-parser'
import { parsePlatforms, parsePlugins } from './plugin-parser'
import {
  findComponentDependencies as findComponentDependenciesImpl,
  findComponentReferenceAt as findComponentReferenceAtImpl,
  findReferencesToComponent as findReferencesToComponentImpl,
  findUsingComponents as findUsingComponentsImpl,
  listComponentReferences as listComponentReferencesImpl,
  pageToFileUrl as pageToFileUrlImpl,
} from './query-impl'
import { listConfigFileCandidates, listMainFileCandidates } from './resolver'
import { findComponentCycles } from './scc'
import { SCHEMA_VERSION } from './schema'
import { startWatch } from './watch'

import type { IInputManifest } from './cache'
import type { IConfigOwnerInput } from './config-graph'
import type { IJsxOwnerInput } from './jsx-graph'
import type { ICreateProjectGraphOptions, IGraphChange, IProjectGraphQuery, KernelLike, TGraphChangeListener, TUnsubscribe } from './query'
import type { IResolveContext } from './resolver'
import type { IAppNode, ICapabilities, ICapabilityEntry, IComponentNode, IEdge, IGraphIssue, INavigationEdge, IPageNode, IPluginNode, IProjectGraph, TContextSource, TFrameworkKind } from './schema'

/** buildProjectGraph 产出：图 + §6 独立 InputManifest（cache/watch 消费，不从成功节点反推）。 */
export interface IBuildResult {
  graph: IProjectGraph
  manifest: IInputManifest
}

/**
 * 由源码目录构建一份完整 ProjectGraph（同步）。
 *
 * @param sourceRoot 源码目录（工程 root/src，或 taroConfig.sourceRoot 指定的目录）
 * @param appPath 工程根（用于插件包名 resolve）
 * @param kernel 可选注入的 Kernel：提供时填充插件节点与 platforms；不提供时二者为空
 * @param alias 路径别名 map（来自 kernel.initialConfig.alias），透传给 config 解析
 */
export function buildProjectGraph(
  sourceRoot: string,
  appPath: string,
  kernel?: KernelLike,
  alias: Record<string, unknown> = {},
  revision = 1,
): IBuildResult {
  const issues: IGraphIssue[] = []
  // §6 InputManifest 累积：已读文件 / 缺失候选 / npm manifest（去重在 assembleManifest）。
  const readFiles: string[] = []
  const missingCandidates: string[] = []
  const packageManifestPaths: string[] = []

  // 任务 1：解析 config → AppNode + 页面路由清单
  const parsed = parseAppConfig(sourceRoot, alias)
  issues.push(...parsed.issues)
  // app.config 恒为输入（存在时）；缺失时其候选路径亦是输入判据（补上 app.config 应失效）。
  if (parsed.app.filePath) {
    readFiles.push(parsed.app.filePath)
  } else {
    // 无 app.config：登记候选（对齐 config-parser APP_CONFIG_BASENAMES）——冷启动后补
    // 建 app.config 应触发失效，否则命中旧空图（§6）。
    missingCandidates.push(path.join(sourceRoot, 'app.config.ts'), path.join(sourceRoot, 'app.config.js'))
  }

  // WP5b：framework 六值判定（§4.1 优先级 options>kernel>静态 package.json>unknown）。
  // 单项目单 AnalysisContext——顶层与逐页取同一值，修 P1 恒 'react' 缺陷。
  const { framework, frameworkSource } = resolveFramework({
    kernelFramework: kernel?.initialConfig?.framework,
    projectRoot: appPath,
  })

  // 任务 2：逐页解析文件（识别 React、抽取跳转）
  const pages: IPageNode[] = []
  const pageIds = new Set(parsed.pageRoutes.map((r) => r.id))
  const perPageNavigations: { pageId: string, navs: ReturnType<typeof parsePageFile>['navigations'] }[] = []

  for (const route of parsed.pageRoutes) {
    const filePath = resolvePageFilePath(sourceRoot, route.id)
    if (filePath == null) {
      // 声明了路由但文件缺失 → PageNode 建不出：这正是 empty-route 的定义
      // （config 声明 routePath 但对应 PageNode 不存在），作结构化事实暴露。
      // routePath 用归一化 id（与 config-parser tabBar 分支一致，不加前导 '/'）。
      issues.push({
        kind: 'empty-route',
        message: `页面 ${route.id} 未找到对应文件`,
        nodeId: route.id,
        routePath: route.id,
      })
      // 缺失页面的候选路径进 missingCandidates（§6）：补上其中任一即应触发重建，
      // 让「声明了路由→补建页面文件」这类场景缓存正确失效（与 resolver 同序候选）。
      missingCandidates.push(...listMainFileCandidates(path.join(sourceRoot, route.id), undefined))
      continue
    }
    // 页面源文件恒为输入。
    readFiles.push(filePath)

    const parsedPage = parsePageFile(filePath, route.id)
    issues.push(...parsedPage.issues)
    // 非 React 页面：P1 仅覆盖 React，属工具覆盖度限制（非结构性事实），
    // 降级该页 jsxAnalyzerStatus='partial'、不产 issue（§3.4 约定）。
    const jsxAnalyzerStatus =
      !parsedPage.readFailed && !parsedPage.isReactPage ? 'partial' : parsedPage.jsxAnalyzerStatus

    const configFilePath = resolvePageConfigPath(filePath) ?? ''
    let pageConfig: Record<string, unknown> = {}
    let configAnalyzerStatus: IPageNode['configAnalyzerStatus'] = 'complete'
    if (configFilePath) {
      readFiles.push(configFilePath) // 页面 config 文件存在即输入（改它应失效）。
      const configResult = readPageConfigContent(configFilePath, alias)
      if (configResult.failed) {
        issues.push({
          kind: 'parse-failed',
          message: `页面 ${route.id} 的 config 解析失败：${configResult.error ?? ''}`,
          filePath: configFilePath,
          nodeId: route.id,
        })
        configAnalyzerStatus = 'failed'
      } else if (configResult.config != null) {
        pageConfig = configResult.config
      }
    } else {
      // 页面**无** config 文件：登记其 config 候选路径为缺失候选（§6）——冷启动后新增
      // page config（声明 usingComponents）应触发缓存失效，否则命中旧图漏掉新组件边。
      missingCandidates.push(...listConfigFileCandidates(filePath))
    }

    pages.push({
      id: route.id,
      routePath: `/${route.id}`,
      filePath,
      configFilePath,
      config: pageConfig,
      framework,
      inSubpackage: route.inSubpackage,
      configAnalyzerStatus,
      jsxAnalyzerStatus,
    })
    perPageNavigations.push({ pageId: route.id, navs: parsedPage.navigations })
  }

  // 构建 navigation 边（需全部页面 id 就绪后才能判定 resolved）
  const edges: IEdge[] = []
  for (const { pageId, navs } of perPageNavigations) {
    edges.push(...buildNavigationEdges(pageId, navs, pageIds))
  }
  // 悬空跳转不再单独产 issue：语义由 INavigationEdge.resolved=false 承接（§3.2 迁移矩阵）。

  // 任务 4（WP4）：Config 组件图——从 app/page/component config 的 usingComponents
  // 抽取声明 → Resolver 解析 → usingComponent 边 + ComponentNode（含递归浅纳入）。
  // JSX componentUsage 边归 WP5，此处只建 config 声明关系。
  const resolveCtx: IResolveContext = {
    projectRoot: appPath,
    alias,
    hasKernel: kernel != null,
    // platform 单值（TARO_ENV）：当前 KernelLike 不暴露单值编译目标，诚实降级为
    // undefined（无 platform）——后缀-only 组件据此走 §4.4 partial 降级，不臆造。
  }
  const owners: IConfigOwnerInput[] = []
  if (parsed.app.filePath) {
    owners.push({ ownerNodeId: parsed.app.id, config: parsed.app.config, configFilePath: parsed.app.filePath })
  }
  for (const p of pages) {
    if (p.configFilePath) {
      owners.push({ ownerNodeId: p.id, config: p.config, configFilePath: p.configFilePath })
    }
  }
  const configGraph = buildConfigComponentGraph(owners, resolveCtx)
  edges.push(...configGraph.edges)
  // §6：汇集 config 通道读过的文件 / 缺失候选 / npm manifest。
  readFiles.push(...configGraph.readFiles)
  missingCandidates.push(...configGraph.missingCandidates)
  packageManifestPaths.push(...configGraph.packageManifestPaths)

  // WP5（§4.3）：JSX componentUsage 图。componentUsage 与 usingComponent 是两类独立
  // 事实（§1.4），JSX 通道只对 React/Preact/Solid 跑（vue3 config-only、none/unknown
  // 不采 JSX，与 capabilities 静态表一致，见 computeCapabilities）。
  const jsxParticipates = jsxParticipatesIn(framework)
  const jsxOwners: IJsxOwnerInput[] = []
  if (jsxParticipates) {
    for (const p of pages) {
      if (p.filePath) jsxOwners.push({ ownerNodeId: p.id, filePath: p.filePath })
    }
  }
  const jsxGraph = buildJsxComponentGraph(jsxOwners, resolveCtx)
  edges.push(...jsxGraph.edges)
  // §6：汇集 JSX 通道读过的文件（含递归展开的组件 .tsx）/ 缺失候选 / npm manifest。
  readFiles.push(...jsxGraph.readFiles)
  missingCandidates.push(...jsxGraph.missingCandidates)
  packageManifestPaths.push(...jsxGraph.packageManifestPaths)

  // 组件节点两来源（config + JSX）按 id 去重合并——同一组件被 config 声明又被 JSX
  // 使用时收敛到一个节点（§3.3 身份唯一）。
  const componentMap = new Map<string, IComponentNode>()
  for (const c of configGraph.components) componentMap.set(c.id, c)
  for (const c of jsxGraph.components) if (!componentMap.has(c.id)) componentMap.set(c.id, c)
  const components = [...componentMap.values()]

  // 应用 owner partial 信号（§3.4：工具限制类 unresolved / 缺精确 span）：把对应
  // app/page 节点的 config/jsx analyzerStatus 降为 partial（已 failed 的不回升）。
  if (configGraph.partialOwners.has(parsed.app.id) && parsed.app.configAnalyzerStatus === 'complete') {
    parsed.app.configAnalyzerStatus = 'partial'
  }
  for (const p of pages) {
    if (configGraph.partialOwners.has(p.id) && p.configAnalyzerStatus === 'complete') {
      p.configAnalyzerStatus = 'partial'
    }
    if (jsxGraph.partialOwners.has(p.id) && p.jsxAnalyzerStatus === 'complete') {
      p.jsxAnalyzerStatus = 'partial'
    }
  }

  // 插件节点与 platforms：仅在注入 Kernel 时填充（§2.6 B 层同源）
  let plugins: IPluginNode[] = []
  let platforms: string[] = []
  const platformsStatus: IProjectGraph['platformsStatus'] = kernel != null ? 'complete' : 'degraded'
  if (kernel != null) {
    const parsedPlugins = parsePlugins(kernel, appPath)
    plugins = parsedPlugins.plugins
    issues.push(...parsedPlugins.issues)
    platforms = parsePlatforms(kernel)
  }

  // 零页面兜底：app.config 声明了页面路由，却一个都没解析到文件（pages 全空）。
  // 多半是 sourceRoot 不对、app.config 用了未注入的别名 import、或页面文件缺失。
  // 补一条顶层 parse-failed，让别名/自定义布局工程得到明确信号，而非静默空图。
  // 门槛用 pageRoutes.length>0：pages:[] 的空工程由 config-parser 单独告警，此处不重复报。
  if (parsed.app.filePath && parsed.pageRoutes.length > 0 && pages.length === 0) {
    issues.push({
      kind: 'parse-failed',
      message: `app.config 声明了 ${parsed.pageRoutes.length} 个页面路由，但无一解析到文件——请检查 sourceRoot 是否正确、app.config 是否用了未注入的路径别名，或页面文件是否存在`,
      filePath: parsed.app.filePath,
    })
  }

  // WP6b：SCC cycle 诊断——local 组件间 resolved 双类边并集的循环依赖（§4.4）。
  for (const cycle of findComponentCycles({ components, edges })) {
    issues.push({
      kind: 'cycle',
      message: `检测到组件循环依赖：${cycle.members.join(' → ')}${cycle.members.length > 1 ? ` → ${cycle.members[0]}` : '（自引用）'}`,
      filePath: firstMemberFilePath(cycle.members, components),
      sccMembers: cycle.members,
    })
  }

  // WP6b 一致性不变式（§3.4）：存在 ≥1 个 parse-failed/partial 节点时，产**一条**
  // 图级 analysis-incomplete 汇总（非每节点重复计）。与节点 analysisStatus、capabilities
  // 的 degraded 聚合同源派生。
  if (hasIncompleteNode(parsed.app, pages, components)) {
    issues.push({
      kind: 'analysis-incomplete',
      message: '部分节点分析不完整（存在 parse-failed 或 partial 的 analyzer 覆盖度），详见各节点 analysisStatus 与 capabilities',
    })
  }

  // §6 InputManifest：Builder 独立产出（含缺失候选 + package/lock + fingerprint），
  // cache/watch 消费——不再从成功节点反推输入。snapshotId 即 manifest hash（单一出处，
  // 确定性、无随机/时间戳）：输入任一变更 → hash 变 → snapshotId 变 + 缓存失效同源。
  // platform 恒 undefined：当前 KernelLike 不暴露单值 TARO_ENV（§4.1，与 resolveCtx 一致）。
  const manifest: IInputManifest = {
    readFiles: [...new Set(readFiles)].sort(),
    missingCandidates: [...new Set(missingCandidates)].sort(),
    packageInputs: [...new Set([...collectPackageInputs(appPath), ...packageManifestPaths])].sort(),
    fingerprint: buildFingerprint({ sourceRoot, framework, platform: undefined, alias }),
  }
  const snapshotId = computeManifestHash(manifest)

  const graph = buildEnvelope({ platforms, platformsStatus, framework, frameworkSource, app: parsed.app, pages, components, plugins, edges, issues, sourceRoot, alias, snapshotId, revision })
  return { graph, manifest }
}

/** 取 cycle 首成员组件的 resolvedFilePath（稳定序首个），供 issue.filePath。 */
function firstMemberFilePath(members: string[], components: IComponentNode[]): string | undefined {
  const first = components.find((c) => c.id === members[0])
  return first?.resolvedFilePath
}

/** 是否存在 analyzer 覆盖度非 complete 的节点（一致性不变式的触发条件，§3.4）。 */
function hasIncompleteNode(app: IAppNode, pages: IPageNode[], components: IComponentNode[]): boolean {
  const notComplete = (s: 'complete' | 'partial' | 'failed') => s !== 'complete'
  if (notComplete(app.configAnalyzerStatus) || notComplete(app.jsxAnalyzerStatus)) return true
  for (const p of pages) {
    if (notComplete(p.configAnalyzerStatus) || notComplete(p.jsxAnalyzerStatus)) return true
  }
  // 组件节点覆盖度当前恒 'complete'（partial 信号只施加于 app/pages 这些 owner，
  // 见 config-graph/jsx-graph 的 partialOwners），故本循环当前不触发——保留为**防御
  // 性兜底**：未来若给组件节点引入 partial/failed 覆盖度，无需改此不变式即自动纳入。
  for (const c of components) {
    if (notComplete(c.configAnalyzerStatus) || notComplete(c.jsxAnalyzerStatus)) return true
  }
  return false
}

/**
 * 由已算出的节点/边/issue 组装 Schema 2.0 顶层 envelope。
 *
 *  - framework：WP5b 六值判定结果（options>kernel>静态>unknown），顶层与逐页
 *    PageNode.framework 同源一致（§4.1）。
 *  - components：config（WP4）+ JSX（WP5）两来源按 id 去重合并的组件层。
 *  - capabilities：两套来源叠加——supported/degraded 聚合自节点 analysisStatus；
 *    unsupported 由 framework×analyzer 静态表判定（computeCapabilities）。
 *  - snapshotId：即 InputManifest content hash（由 buildProjectGraph 算好传入，与
 *    cache 失效判定同源，确定性、无随机/时间戳）。
 *  - analysisContext：记录最终值 + 来源；platform 无 Kernel 不可得（§10 OQ-016）。
 */
function buildEnvelope(parts: {
  platforms: string[]
  platformsStatus: IProjectGraph['platformsStatus']
  framework: TFrameworkKind
  frameworkSource: TContextSource
  app: IAppNode
  pages: IPageNode[]
  components: IComponentNode[]
  plugins: IPluginNode[]
  edges: IEdge[]
  issues: IGraphIssue[]
  sourceRoot: string
  alias: Record<string, unknown>
  snapshotId: string
  revision: number
}): IProjectGraph {
  const { platforms, platformsStatus, framework, frameworkSource, app, pages, components, plugins, edges, issues, sourceRoot, alias, snapshotId, revision } = parts

  // capabilities：两套来源叠加（§3.4）——supported/degraded 聚合自节点 analysisStatus；
  // unsupported 由 framework×analyzer 静态表判定（WP5b.2）。
  const configOwners = [app.configAnalyzerStatus, ...pages.map((p) => p.configAnalyzerStatus)]
  const jsxOwners = [app.jsxAnalyzerStatus, ...pages.map((p) => p.jsxAnalyzerStatus)]
  const capabilities = computeCapabilities(framework, configOwners, jsxOwners)

  return {
    schemaVersion: SCHEMA_VERSION,
    // WP5b：六值判定（§4.1），顶层与逐页 PageNode.framework 同源一致。
    framework,
    platforms,
    platformsStatus,
    app,
    pages,
    components,
    plugins,
    edges,
    capabilities,
    issues,
    snapshotId,
    revision,
    analysisContext: {
      framework,
      frameworkSource,
      platformSource: platformsStatus === 'complete' ? 'kernel' : 'default',
      sourceRoot,
      sourceRootSource: 'default',
      alias,
      aliasSource: Object.keys(alias).length > 0 ? 'kernel' : 'default',
    },
  }
}

/**
 * 把一组节点的 analysisStatus 聚合成单 analyzer 的 capability 条目（§3.4）：
 *  - 全 complete → supported；
 *  - 存在 failed/partial → degraded，failedCount 计非 complete 节点数，total 计参与节点数。
 */
function aggregateCapability(statuses: Array<'complete' | 'partial' | 'failed'>): ICapabilityEntry {
  const total = statuses.length
  const failedCount = statuses.filter((s) => s !== 'complete').length
  if (failedCount === 0) return { status: 'supported' }
  return { status: 'degraded', failedCount, total }
}

/**
 * 按 framework×analyzer 静态表 + 节点聚合，算三个 analyzer 的 capability（§3.4 / WP5b.2）。
 *
 * 两套来源叠加：
 *  - configAnalyzer：对全部六值均聚合（supported/degraded），无 unsupported。
 *  - jsxAnalyzer   ：react/preact/solid 参与聚合；vue3='deferred'（有 JSX render
 *    function、概念适用但 P2 不采）；none='not-applicable'；unknown 暂 'not-applicable'
 *    （§12② 待收口）。
 *  - templateAnalyzer：react/preact/solid/none/unknown='not-applicable'；vue3='deferred'
 *    （Vue3 template 概念适用但本期不做）。
 */
function computeCapabilities(
  framework: TFrameworkKind,
  configOwners: Array<'complete' | 'partial' | 'failed'>,
  jsxOwners: Array<'complete' | 'partial' | 'failed'>,
): ICapabilities {
  const jsxParticipates = jsxParticipatesIn(framework)
  const jsxAnalyzer: ICapabilityEntry = jsxParticipates
    ? aggregateCapability(jsxOwners)
    : framework === 'vue3'
      ? { status: 'unsupported', reason: 'deferred' }
      : { status: 'unsupported', reason: 'not-applicable' } // none / unknown
  const templateAnalyzer: ICapabilityEntry =
    framework === 'vue3'
      ? { status: 'unsupported', reason: 'deferred' }
      : { status: 'unsupported', reason: 'not-applicable' }
  return {
    configAnalyzer: aggregateCapability(configOwners),
    jsxAnalyzer,
    templateAnalyzer,
  }
}

/**
 * createProjectGraph 的实现：构建/缓存项目图，返回查询实例。
 *
 * - 构建：优先读持久化缓存（`.taro/graph.cache.json`），content hash 命中且
 *   schemaVersion 匹配则跳过冷启动；否则重建并写缓存。
 * - 注入 kernel 时填充插件节点与 platforms（§2.6）；未注入时二者为空。
 * - onGraphChange：dev-time 订阅。首个订阅者到来时惰性启动 chokidar 监听
 *   源码目录（sourceRoot，默认 src/，随 kernel.initialConfig.sourceRoot）与 config/，
 *   文件变更 → 重建图 → 通知订阅者；最后一个取消订阅后停止监听。
 *
 * 注：监听重建会连同注入的 kernel 一起重算（plugins/platforms 随之刷新为 kernel 当前
 * 状态）；但监听只侦测源码目录与 config/ 的文件变更，kernel 自身的状态变化不触发重建。
 */
export function createProjectGraph(options: ICreateProjectGraphOptions): IProjectGraphQuery {
  // sourceRoot / alias 优先取注入 kernel 的求值配置（kernel.initialConfig.sourceRoot
  // 默认 'src'、alias 默认 {}）；未注入 Kernel（如纯 CLI）时回退默认 src/ 且无别名。
  const { sourceDirName, alias } = deriveSourceConfig(options.kernel)
  const sourceRoot = path.join(options.root, sourceDirName)

  // 可变引用：监听重建时替换
  let graph = loadOrBuild(options, sourceRoot, alias)

  // 订阅者与监听器（惰性启动）
  const listeners = new Set<TGraphChangeListener>()
  let watcher: { close: () => void } | undefined

  const notify = (change: IGraphChange): void => {
    // 单个 listener 抛错不影响其余 listener，也不冒泡到防抖 setTimeout。
    for (const listener of listeners) {
      try {
        listener(change)
      } catch {
        // 忽略 listener 内部错误
      }
    }
  }

  const rebuild = (changedPaths: string[]): void => {
    let next: IBuildResult
    try {
      // revision 单调递增：以当前活图 revision + 1 重建（§6）。
      next = buildProjectGraph(sourceRoot, options.root, options.kernel, alias, graph.revision + 1)
    } catch (err) {
      // 本回调跑在 chokidar 的防抖 setTimeout 里；buildProjectGraph 真抛非预期错误
      // （如 src 目录被删、底层 IO 异常）时**保留旧快照**、发失败事件，不暴露半成品、
      // 不 crash 宿主（长驻控制面）。编辑中间态坏 config 由 config-parser 降级为 issue、
      // 不走本分支——那类是"成功重建出一张带 parse-failed 的图"。
      notify({ ok: false, changedFiles: changedPaths, error: (err as Error)?.message ?? String(err) })
      return
    }
    // 原子替换（§6）：先落盘（writeCache 内部 temp+rename 原子），再切活图引用、发成功
    // 事件——磁盘快照先就位，getProjectGraph 与 cache 文件不会出现"内存已换、磁盘未换"窗口。
    // §6：cache 消费 Builder 独立产出的 InputManifest（不再从成功节点反推输入）。
    writeCache(options.root, next.graph, next.manifest, computeManifestHash(next.manifest))
    graph = next.graph
    notify({ ok: true, changedFiles: changedPaths, revision: next.graph.revision })
  }

  const ensureWatching = (): void => {
    if (watcher != null) return
    // §6：额外监听 root package.json + lockfile——装包/删包/改版本触发 external↔npm
    // 迁移，须重建（不长期监听整个 node_modules）。快照时点存在的文件才监听。
    const packageInputs = collectPackageInputs(options.root)
    watcher = startWatch(options.root, sourceRoot, (changed) => rebuild(changed), packageInputs)
  }

  return {
    getProjectGraph() {
      return graph
    },
    findPageByRoute(routePath) {
      const id = urlToRouteId(routePath)
      return graph.pages.find((p) => p.id === id)
    },
    findPageByFilePath(filePath) {
      return graph.pages.find((p) => p.filePath === filePath)
    },
    findReferencesToPage(pageId): INavigationEdge[] {
      // IEdge 现为三成员联合，只有 navigation 边的 to 指向页面；先按 kind 收窄，
      // 避免组件边（componentUsage/usingComponent）的 to 与 pageId 偶然同串误命中。
      return graph.edges.filter((e): e is INavigationEdge => e.kind === 'navigation' && e.to === pageId)
    },
    getPlugins(): IPluginNode[] {
      return graph.plugins
    },
    findPluginById(id) {
      // 先精确匹配；再兜底：节点 id 可能是解析路径（包名 resolve 失败时退化），
      // 而调用方常用包名查——用"路径以 /<包名> 结尾"匹配，兼容两种形态。
      const exact = graph.plugins.find((p) => p.id === id)
      if (exact != null) return exact
      const suffix = `/${id}`
      return graph.plugins.find((p) => p.id.endsWith(suffix))
    },
    getPlatforms() {
      return graph.platforms // 未注入 Kernel 时为 []
    },
    // ---- P2 新增查询（WP6a/WP6b）：委托 query-impl 纯函数 ----------------------
    pageToFileUrl(pageId): string {
      return pageToFileUrlImpl(graph, pageId)
    },
    findComponentDependencies(selector, opts) {
      return findComponentDependenciesImpl(graph, selector, opts)
    },
    findUsingComponents(owner): IEdge[] {
      return findUsingComponentsImpl(graph, owner)
    },
    findReferencesToComponent(selector): IEdge[] {
      return findReferencesToComponentImpl(graph, selector)
    },
    findComponentReferenceAt(filePath, position): IEdge | undefined {
      return findComponentReferenceAtImpl(graph, filePath, position)
    },
    listComponentReferences(filter): IEdge[] {
      return listComponentReferencesImpl(graph, filter)
    },
    getGraphSummary() {
      return {
        schemaVersion: graph.schemaVersion,
        snapshotId: graph.snapshotId,
        analysisContext: graph.analysisContext,
        capabilities: graph.capabilities,
        issues: graph.issues,
        counts: {
          pages: graph.pages.length,
          components: graph.components.length,
          plugins: graph.plugins.length,
          navigationEdges: graph.edges.filter((e) => e.kind === 'navigation').length,
          usingComponentEdges: graph.edges.filter((e) => e.kind === 'usingComponent').length,
          componentUsageEdges: graph.edges.filter((e) => e.kind === 'componentUsage').length,
        },
      }
    },
    onGraphChange(listener: TGraphChangeListener): TUnsubscribe {
      listeners.add(listener)
      ensureWatching()
      return () => {
        listeners.delete(listener)
        // 无订阅者时停止监听，释放资源
        if (listeners.size === 0 && watcher != null) {
          watcher.close()
          watcher = undefined
        }
      }
    },
    dispose() {
      // 生命周期终点（§6）：停 watcher、清订阅者。幂等——watcher 已停 / 无订阅者时安全。
      if (watcher != null) {
        watcher.close()
        watcher = undefined
      }
      listeners.clear()
    },
  }
}

/**
 * 读缓存命中则跳过冷启动，否则重建并写缓存。
 *
 * 命中路径**不调用 buildProjectGraph**（那含对 app.config + 每个 page.config 的
 * TS 编译，是冷启动主要成本）——直接复用缓存的静态图，仅用注入的 kernel 就地重算
 * 插件/platforms（不涉及文件编译，成本低）。这才真正实现"重启跳过冷启动"。
 *
 * §6 失效正确性（manifest 驱动，非从成功节点反推）：拿缓存记录的 InputManifest，按
 * 当前磁盘重算其 hash 与记录比对。manifest 覆盖已读文件（app/page/component config +
 * 页面与组件源码 + barrel 中转）、**缺失候选**（补上 typo 路径 / 后缀-only 主文件即变）、
 * package/lock（装包/删包/改版本）、fingerprint（sourceRoot/alias/framework/platform）。
 * 故命中即全部输入确未变；补文件、装包、改组件源码等 P1 盲区在此正确失效。
 */
function loadOrBuild(options: ICreateProjectGraphOptions, sourceRoot: string, alias: Record<string, unknown>): IProjectGraph {
  const cached = readCache(options.root)
  if (cached != null) {
    // §6 命中判定必须用**当前 context** 的 fingerprint（不能自哈希缓存里存的那份，否则
    // fingerprint 两侧恒等、对命中零贡献 → 改 alias/kernel-framework/sourceRoot 跨重启误
    // 命中旧图）。framework 与 buildProjectGraph 同源派生（resolveFramework，读 package.json，
    // 廉价）；platform 恒 undefined（§4.1，KernelLike 不暴露单值 TARO_ENV）。
    const { framework } = resolveFramework({
      kernelFramework: options.kernel?.initialConfig?.framework,
      projectRoot: options.root,
    })
    const currentFingerprint = buildFingerprint({ sourceRoot, framework, platform: undefined, alias })
    // 用缓存记录的输入文件清单（去磁盘重读内容）+ **当前** fingerprint 重算 hash。文件内容变
    // 或 context 变，任一都 miss。
    const currentHash = computeManifestHash({ ...cached.manifest, fingerprint: currentFingerprint })
    if (currentHash === cached.contentHash) {
      // 命中：静态部分复用缓存；插件/platforms 由 kernel 就地重算（不进缓存 hash）
      const plugins = options.kernel != null ? parsePlugins(options.kernel, options.root).plugins : []
      const platforms = options.kernel != null ? parsePlatforms(options.kernel) : []
      const platformsStatus: IProjectGraph['platformsStatus'] = options.kernel != null ? 'complete' : 'degraded'
      return { ...cached.graph, plugins, platforms, platformsStatus }
    }
  }
  // 未命中：冷启动重建并写缓存（消费 Builder 独立产出的 manifest）。
  const fresh = buildProjectGraph(sourceRoot, options.root, options.kernel, alias)
  writeCache(options.root, fresh.graph, fresh.manifest, computeManifestHash(fresh.manifest))
  return fresh.graph
}

/**
 * 从注入的 kernel 提取源码目录名与路径别名。
 *
 * kernel.initialConfig 是求值后的 Taro 编译配置：sourceRoot 默认 'src'、alias 默认 {}
 * （见 @tarojs/service Config.getConfigWithNamed）。未注入 kernel（纯 CLI / 无 Kernel
 * 场景）时回退默认 src/ 且无别名——此时用别名 import 的 app.config 会解析失败并告警。
 */
function deriveSourceConfig(kernel?: KernelLike): { sourceDirName: string, alias: Record<string, unknown> } {
  const cfg = kernel?.initialConfig
  const sourceDirName = typeof cfg?.sourceRoot === 'string' && cfg.sourceRoot ? cfg.sourceRoot : 'src'
  const alias = cfg?.alias != null && typeof cfg.alias === 'object' && !Array.isArray(cfg.alias) ? cfg.alias : {}
  return { sourceDirName, alias }
}
