/**
 * @tarojs/project-graph — config 解析（任务 1）
 *
 * 复用 @tarojs/helper 的 readConfig 读取 app.config，产出 AppNode 与页面来源清单。
 * 本模块只负责「读 config → 组装页面路由清单」，不识别 React 页面、不建边（任务 2）。
 *
 * 页面来源（P1 页面来源清单，前置调研结论）：
 *  - app.config 的 pages[]           —— 主包页面
 *  - subPackages[].root + pages[]     —— 分包页面（加 root 前缀，标 inSubpackage）
 *  - tabBar.list[].pagePath           —— 必须存在于上述 pages，否则告警
 *
 * 解析失败（readConfig 抛错 / 返回空）通过 GraphWarning 暴露，避免静默误判。
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { readConfig, resolveScriptPath } from '@tarojs/helper'

import type { AppConfig, AppNode, GraphWarning } from './schema'

/** app.config 的候选文件名（相对 sourceRoot）。 */
const APP_CONFIG_BASENAMES = ['app.config.ts', 'app.config.js']

/** 解析出的单个页面路由项（任务 2 据此识别文件与建节点）。 */
export interface PageRoute {
  /** 路由 id，如 'pages/index/index' 或 'pkgA/pages/foo'（唯一）。 */
  id: string
  /** 归属分包 root（主包页面为 undefined）。 */
  inSubpackage?: string
}

/** config 解析结果。 */
export interface ParsedConfig {
  app: AppNode
  /** 去重后的页面路由清单（含主包 + 分包）。 */
  pageRoutes: PageRoute[]
  warnings: GraphWarning[]
}

/** 归一化路由：统一分隔符、去首尾多余斜杠。 */
export function normalizeRoute(route: string): string {
  return route
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
}

/** 在 sourceRoot 下定位 app.config 文件；找不到返回 undefined。 */
export function findAppConfigPath(sourceRoot: string): string | undefined {
  for (const basename of APP_CONFIG_BASENAMES) {
    const candidate = path.join(sourceRoot, basename)
    if (fs.existsSync(candidate)) return candidate
  }
  return undefined
}

/**
 * 从任意值收集非空字符串项。返回保留的字符串与被丢弃的元素个数
 * （非字符串、或空串——如动态拼接产物、`pages: ['']` 等），供调用方告警。
 */
function collectStrings(value: unknown): { values: string[], dropped: number } {
  if (!Array.isArray(value)) return { values: [], dropped: 0 }
  const values: string[] = []
  let dropped = 0
  for (const item of value) {
    if (typeof item === 'string' && item.trim().length > 0) {
      values.push(item)
    } else {
      dropped += 1
    }
  }
  return { values, dropped }
}

/** 从标准化 config 对象收集分包页面路由；dropped 汇总被丢弃的页面元素数。 */
function collectSubpackageRoutes(config: AppConfig): {
  routes: PageRoute[]
  dropped: number
} {
  const subPackages = config.subPackages ?? config.subpackages
  if (!Array.isArray(subPackages)) return { routes: [], dropped: 0 }

  const routes: PageRoute[] = []
  let dropped = 0
  for (const item of subPackages) {
    if (item == null || typeof item !== 'object') continue
    const root = (item as Record<string, unknown>).root
    const { values: pages, dropped: subDropped } = collectStrings(
      (item as Record<string, unknown>).pages,
    )
    dropped += subDropped
    if (typeof root !== 'string' || root.length === 0) {
      // root 缺失/非法：其下合法页面无法定位，计入 dropped 以免静默漏页。
      dropped += pages.length
      continue
    }
    for (const page of pages) {
      routes.push({
        id: normalizeRoute(`${root}/${page}`),
        inSubpackage: normalizeRoute(root),
      })
    }
  }
  return { routes, dropped }
}

/** 收集 tabBar.list[].pagePath，用于校验其存在于 pages。 */
function collectTabBarPagePaths(config: AppConfig): string[] {
  const tabBar = config.tabBar
  if (tabBar == null || typeof tabBar !== 'object') return []
  const list = (tabBar as Record<string, unknown>).list
  if (!Array.isArray(list)) return []
  const paths: string[] = []
  for (const item of list) {
    if (item == null || typeof item !== 'object') continue
    const pagePath = (item as Record<string, unknown>).pagePath
    if (typeof pagePath === 'string') paths.push(normalizeRoute(pagePath))
  }
  return paths
}

/**
 * 解析 app.config，产出 AppNode 与页面路由清单。
 *
 * 关于「动态生成的 pages」：readConfig 会实际执行 config 模块，故用代码拼接
 * 出的 pages 数组在求值时已展开，无需静态 AST 处理。RFC-0003 提到的
 * `__taroAsyncComponent__` 经核查在主仓源码中不存在（疑为早期方案的占位标识），
 * 故本实现不为其编写处理逻辑；非字符串 / 空串的页面项统一计入 dropped 并告警。
 *
 * @param sourceRoot 源码目录的**绝对路径**（即 Taro 的 sourceDir = `<工程 root>/src`，
 *   由 taroConfig.sourceRoot 解析而来）。必须非空绝对路径；传空串或相对串会导致
 *   页面文件解析失败。
 */
export function parseAppConfig(sourceRoot: string): ParsedConfig {
  const warnings: GraphWarning[] = []
  const appConfigPath = findAppConfigPath(sourceRoot)

  if (!appConfigPath) {
    warnings.push({
      kind: 'config_parse_failed',
      message: `未在 ${sourceRoot} 找到 app.config.ts / app.config.js`,
      filePath: sourceRoot,
    })
    return {
      app: { filePath: '', config: {} },
      pageRoutes: [],
      warnings,
    }
  }

  let config: AppConfig = {}
  try {
    // 注：readConfig 支持 alias / defineConstants，但需调用方传入对应 map；
    // 任务 1 阶段无 Kernel 来源，故不传。若 app.config 用 alias import，
    // 解析可能失败并落入下方 config_parse_failed。alias 注入待后续（任务 5 / Kernel）。
    config = (readConfig(appConfigPath) ?? {}) as AppConfig
  } catch (err) {
    warnings.push({
      kind: 'config_parse_failed',
      message: `解析 app.config 失败：${(err as Error).message}`,
      filePath: appConfigPath,
    })
    return {
      app: { filePath: appConfigPath, config: {} },
      pageRoutes: [],
      warnings,
    }
  }

  const { values: mainPages, dropped: mainDropped } = collectStrings(
    config.pages,
  )
  const mainRoutes: PageRoute[] = mainPages.map((page) => ({
    id: normalizeRoute(page),
  }))
  const { routes: subRoutes, dropped: subDropped } =
    collectSubpackageRoutes(config)

  // pages 缺失或全部无效：视为异常，告警而非静默产出空清单
  // （对齐 vite-runner getPages 对空 pages 的 fatal 处理）。
  if (mainRoutes.length === 0) {
    warnings.push({
      kind: 'config_parse_failed',
      message: 'app.config 的 pages 缺失或为空，无法确定主包页面',
      filePath: appConfigPath,
    })
  }
  // 动态拼接、非字符串或空串的页面元素被丢弃时告警，避免静默漏页。
  const droppedPages = mainDropped + subDropped
  if (droppedPages > 0) {
    warnings.push({
      kind: 'unresolved',
      message: `${droppedPages} 个页面项非静态字符串（动态拼接或空值），已跳过；如需覆盖请核对 config`,
      filePath: appConfigPath,
    })
  }

  // 合并主包 + 分包并按 id 去重（先出现者优先，主包在前）。
  const byId = new Map<string, PageRoute>()
  for (const route of [...mainRoutes, ...subRoutes]) {
    if (!byId.has(route.id)) byId.set(route.id, route)
  }
  const pageRoutes = [...byId.values()]

  // 校验 tabBar.list[].pagePath 存在于 pages。
  const pageIds = new Set(pageRoutes.map((r) => r.id))
  for (const pagePath of collectTabBarPagePaths(config)) {
    if (!pageIds.has(pagePath)) {
      warnings.push({
        kind: 'broken_navigation',
        message: `tabBar.list 中的 pagePath "${pagePath}" 不在 pages 列表内`,
        filePath: appConfigPath,
        nodeId: pagePath,
      })
    }
  }

  return {
    app: { filePath: appConfigPath, config },
    pageRoutes,
    warnings,
  }
}

/**
 * 将页面路由 id 解析为实际文件路径。复用 helper resolveScriptPath，覆盖多端文件
 * 后缀（如 index.weapp.tsx）。动态生成的页面（config 里用代码拼出的 pages）由
 * readConfig 执行 config 时求值覆盖，无需此处处理。
 * 找不到文件时返回 undefined（由调用方记 warning）。
 */
export function resolvePageFilePath(
  sourceRoot: string,
  routeId: string,
): string | undefined {
  const resolved = resolveScriptPath(path.join(sourceRoot, routeId))
  return fs.existsSync(resolved) ? resolved : undefined
}
