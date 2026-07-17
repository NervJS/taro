/**
 * @tarojs/project-graph — 图构建与查询实现（任务 2 / 3 / 5）
 *
 * 组装 config 解析（任务 1）+ 页面解析（任务 2）+ 插件解析（任务 3）为完整
 * ProjectGraph，并实现 createProjectGraph 工厂与查询函数。插件节点与 platforms
 * 仅在注入 Kernel 时填充（§2.6）。持久化缓存与 dev-time 监听增量见任务 5
 * （cache.ts / watch.ts）。
 */

import * as path from 'node:path'

import { buildSeed, collectInputFiles, computeContentHash, readCache, writeCache } from './cache'
import { parseAppConfig, readPageConfigContent, resolvePageConfigPath, resolvePageFilePath } from './config-parser'
import { buildNavigationEdges, parsePageFile, urlToRouteId } from './page-parser'
import { parsePlatforms, parsePlugins } from './plugin-parser'
import { SCHEMA_VERSION } from './schema'
import { startWatch } from './watch'

import type { CreateProjectGraphOptions, GraphChange, GraphChangeListener, KernelLike, ProjectGraphQuery, Unsubscribe } from './query'
import type { Edge, GraphWarning, PageNode, PluginNode, ProjectGraph } from './schema'

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
): ProjectGraph {
  const warnings: GraphWarning[] = []

  // 任务 1：解析 config → AppNode + 页面路由清单
  const parsed = parseAppConfig(sourceRoot, alias)
  warnings.push(...parsed.warnings)

  // 任务 2：逐页解析文件（识别 React、抽取跳转）
  const pages: PageNode[] = []
  const pageIds = new Set(parsed.pageRoutes.map((r) => r.id))
  const perPageNavigations: { pageId: string, navs: ReturnType<typeof parsePageFile>['navigations'] }[] = []

  for (const route of parsed.pageRoutes) {
    const filePath = resolvePageFilePath(sourceRoot, route.id)
    if (filePath == null) {
      warnings.push({
        kind: 'unresolved',
        message: `页面 ${route.id} 未找到对应文件`,
        nodeId: route.id,
      })
      continue
    }

    const parsedPage = parsePageFile(filePath, route.id)
    warnings.push(...parsedPage.warnings)
    if (!parsedPage.readFailed && !parsedPage.isReactPage) {
      warnings.push({
        kind: 'unresolved',
        message: `页面 ${route.id} 未识别为 React 页面（P1 仅 React）`,
        filePath,
        nodeId: route.id,
      })
      // 仍建节点，但记录告警（便于 taro-pilot 诊断非 React 页面）
    }

    const configFilePath = resolvePageConfigPath(filePath) ?? ''
    let pageConfig: Record<string, unknown> = {}
    if (configFilePath) {
      const configResult = readPageConfigContent(configFilePath, alias)
      if (configResult.failed) {
        warnings.push({
          kind: 'config_parse_failed',
          message: `页面 ${route.id} 的 config 解析失败：${configResult.error ?? ''}`,
          filePath: configFilePath,
          nodeId: route.id,
        })
      } else if (configResult.config != null) {
        pageConfig = configResult.config
      }
    }

    pages.push({
      id: route.id,
      routePath: `/${route.id}`,
      filePath,
      configFilePath,
      config: pageConfig,
      framework: 'react',
      inSubpackage: route.inSubpackage,
    })
    perPageNavigations.push({ pageId: route.id, navs: parsedPage.navigations })
  }

  // 构建 navigation 边（需全部页面 id 就绪后才能判定 resolved）
  const edges: Edge[] = []
  for (const { pageId, navs } of perPageNavigations) {
    edges.push(...buildNavigationEdges(pageId, navs, pageIds))
  }

  // 悬空跳转补一条 broken_navigation 告警
  for (const edge of edges) {
    if (edge.resolved === false) {
      warnings.push({
        kind: 'broken_navigation',
        message: `页面 ${edge.from} 通过 ${edge.via} 跳转到不存在的页面 ${edge.to}`,
        nodeId: edge.from,
      })
    }
  }

  // 插件节点与 platforms：仅在注入 Kernel 时填充（§2.6 B 层同源）
  let plugins: PluginNode[] = []
  let platforms: string[] = []
  if (kernel != null) {
    const parsedPlugins = parsePlugins(kernel, appPath)
    plugins = parsedPlugins.plugins
    warnings.push(...parsedPlugins.warnings)
    platforms = parsePlatforms(kernel)
  }

  // 零页面兜底：app.config 声明了页面路由，却一个都没解析到文件（pages 全空），
  // 多半是 sourceRoot 不对、app.config 用了未注入的别名 import、或页面文件缺失。
  // 补一条顶层告警，让别名/自定义布局工程得到明确信号，而非静默空图。
  // 门槛用 pageRoutes.length>0：pages:[] 的空工程由 config-parser 单独告警，此处不重复报。
  if (parsed.app.filePath && parsed.pageRoutes.length > 0 && pages.length === 0) {
    warnings.push({
      kind: 'config_parse_failed',
      message: `app.config 声明了 ${parsed.pageRoutes.length} 个页面路由，但无一解析到文件——请检查 sourceRoot 是否正确、app.config 是否用了未注入的路径别名，或页面文件是否存在`,
      filePath: parsed.app.filePath,
    })
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    framework: 'react',
    platforms,
    app: parsed.app,
    pages,
    plugins,
    edges,
    warnings,
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
export function createProjectGraph(options: CreateProjectGraphOptions): ProjectGraphQuery {
  // sourceRoot / alias 优先取注入 kernel 的求值配置（kernel.initialConfig.sourceRoot
  // 默认 'src'、alias 默认 {}）；未注入 Kernel（如纯 CLI）时回退默认 src/ 且无别名。
  const { sourceDirName, alias } = deriveSourceConfig(options.kernel)
  const sourceRoot = path.join(options.root, sourceDirName)
  const seed = buildSeed(sourceRoot, alias)

  // 可变引用：监听重建时替换
  let graph = loadOrBuild(options, sourceRoot, alias)

  // 订阅者与监听器（惰性启动）
  const listeners = new Set<GraphChangeListener>()
  let watcher: { close: () => void } | undefined

  const rebuild = (changedPaths: string[]): void => {
    let next: ProjectGraph
    try {
      next = buildProjectGraph(sourceRoot, options.root, options.kernel, alias)
    } catch {
      // 本回调跑在 chokidar 的防抖 setTimeout 里；用户存了语法损坏的 app.config /
      // 页面（编辑中间态）会让 buildProjectGraph 抛出，若不吞则 crash 宿主（长驻控制面）。
      // 保留上一份可用图，下次成功重建再通知订阅者。
      return
    }
    graph = next
    writeCache(options.root, graph, computeContentHash(collectInputFiles(graph), seed))
    const change: GraphChange = { changedFiles: changedPaths }
    // 单个 listener 抛错不影响其余 listener，也不冒泡到防抖 setTimeout
    for (const listener of listeners) {
      try {
        listener(change)
      } catch {
        // 忽略 listener 内部错误
      }
    }
  }

  const ensureWatching = (): void => {
    if (watcher != null) return
    watcher = startWatch(options.root, sourceRoot, (changed) => rebuild(changed))
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
    findReferencesToPage(pageId) {
      return graph.edges.filter((e) => e.to === pageId)
    },
    getPlugins(): PluginNode[] {
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
    onGraphChange(listener: GraphChangeListener): Unsubscribe {
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
  }
}

/**
 * 读缓存命中则跳过冷启动，否则重建并写缓存。
 *
 * 命中路径**不调用 buildProjectGraph**（那含对 app.config + 每个 page.config 的
 * TS 编译，是冷启动主要成本）——直接复用缓存的静态图，仅用注入的 kernel 就地重算
 * 插件/platforms（不涉及文件编译，成本低）。这才真正实现"重启跳过冷启动"。
 *
 * 失效正确性：app.config 恒在输入文件里，页面集增删必改 app.config → hash 必变；
 * 页面文件 / 页面 config 变更也在输入里。sourceRoot / alias 来自 kernel、不落文件，
 * 经 seed 进 hash（否则空图会在不同 root/alias 间误命中）。故 hash 命中即静态部分确未变。
 */
function loadOrBuild(options: CreateProjectGraphOptions, sourceRoot: string, alias: Record<string, unknown>): ProjectGraph {
  const seed = buildSeed(sourceRoot, alias)
  const cached = readCache(options.root)
  if (cached != null) {
    // 用缓存图记录的输入文件 + 当前 seed 算 hash，与缓存记录比对
    const currentHash = computeContentHash(collectInputFiles(cached.graph), seed)
    if (currentHash === cached.contentHash) {
      // 命中：静态部分复用缓存；插件/platforms 由 kernel 就地重算（不进缓存 hash）
      const plugins = options.kernel != null ? parsePlugins(options.kernel, options.root).plugins : []
      const platforms = options.kernel != null ? parsePlatforms(options.kernel) : []
      return { ...cached.graph, plugins, platforms }
    }
  }
  // 未命中：冷启动重建并写缓存
  const fresh = buildProjectGraph(sourceRoot, options.root, options.kernel, alias)
  writeCache(options.root, fresh, computeContentHash(collectInputFiles(fresh), seed))
  return fresh
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
