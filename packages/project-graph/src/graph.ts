/**
 * @tarojs/project-graph — 图构建与查询实现（任务 2 / 任务 3）
 *
 * 组装 config 解析（任务 1）+ 页面解析（任务 2）+ 插件解析（任务 3）为完整
 * ProjectGraph，并实现 createProjectGraph 工厂与查询函数。插件节点与 platforms
 * 仅在注入 Kernel 时填充（§2.6）。
 */

import * as path from 'node:path'

import { parseAppConfig, readPageConfigContent, resolvePageConfigPath, resolvePageFilePath } from './config-parser'
import { buildNavigationEdges, parsePageFile, urlToRouteId } from './page-parser'
import { parsePlatforms, parsePlugins } from './plugin-parser'
import { SCHEMA_VERSION } from './schema'

import type { CreateProjectGraphOptions, GraphChangeListener, KernelLike, ProjectGraphQuery, Unsubscribe } from './query'
import type { Edge, GraphWarning, PageNode, PluginNode, ProjectGraph } from './schema'

/**
 * 由源码目录构建一份完整 ProjectGraph（同步）。
 *
 * @param sourceRoot 源码目录（工程 root/src）
 * @param appPath 工程根（用于插件包名 resolve）
 * @param kernel 可选注入的 Kernel：提供时填充插件节点与 platforms；不提供时二者为空
 */
export function buildProjectGraph(
  sourceRoot: string,
  appPath: string,
  kernel?: KernelLike,
): ProjectGraph {
  const warnings: GraphWarning[] = []

  // 任务 1：解析 config → AppNode + 页面路由清单
  const parsed = parseAppConfig(sourceRoot)
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
      const configResult = readPageConfigContent(configFilePath)
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
 * createProjectGraph 的实现：构建一次快照图，返回查询实例。
 *
 * 注入 kernel 时填充插件节点与 platforms（§2.6）；未注入时二者为空。
 * onGraphChange 的增量能力由任务 5 完善，本实现先返回图快照上的静态查询。
 */
export function createProjectGraph(options: CreateProjectGraphOptions): ProjectGraphQuery {
  const sourceRoot = path.join(options.root, 'src')
  const graph = buildProjectGraph(sourceRoot, options.root, options.kernel)

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
    onGraphChange(_listener: GraphChangeListener): Unsubscribe {
      // 任务 5 实现 dev-time 增量订阅；P1 此处先返回 no-op 取消函数
      return () => {}
    },
  }
}
