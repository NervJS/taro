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

import type { AppConfig, AppNode, GraphWarning, PageConfig } from './schema'

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
    const { values: pages, dropped: subDropped } = collectStrings((item as Record<string, unknown>).pages)
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
 * @param alias 路径别名 map（来自 kernel.initialConfig.alias），透传给 readConfig 的
 *   esbuild，使 app.config 内的别名 import 可解析；未注入 Kernel 时为空、别名 import 会解析失败并告警。
 */
export function parseAppConfig(sourceRoot: string, alias: Record<string, unknown> = {}): ParsedConfig {
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
    // 别名由调用方（createProjectGraph 从 kernel.initialConfig.alias）透传；未注入
    // Kernel 时为空 map，app.config 若用别名 import 则解析失败并落入下方 config_parse_failed。
    config = (readConfig(appConfigPath, { alias }) ?? {}) as AppConfig
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

  const { values: mainPages, dropped: mainDropped } = collectStrings(config.pages)
  const mainRoutes: PageRoute[] = mainPages.map((page) => ({
    id: normalizeRoute(page),
  }))
  const { routes: subRoutes, dropped: subDropped } = collectSubpackageRoutes(config)

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
export function resolvePageFilePath(sourceRoot: string, routeId: string): string | undefined {
  const resolved = resolveScriptPath(path.join(sourceRoot, routeId))
  return fs.existsSync(resolved) ? resolved : undefined
}

/**
 * 由页面文件路径推断其 config 文件路径。
 * Taro 页面 config 恒为 `.config.ts`/`.config.js`（纯对象、无 JSX），且与页面
 * 同名同端后缀：index.tsx → index.config.ts、index.weapp.tsx → index.weapp.config.ts。
 * 复用 helper resolveScriptPath 定位实际存在的 config 文件；找不到返回 undefined。
 *
 * P1 限制：不 strip 多端后缀。Taro 惯例下多端页面可共享单个 index.config.ts，
 * 此处 `index.weapp.tsx` 只找 `index.weapp.config.*`、不回退共享 config；且未设置
 * TARO_ENV。纯 `index.tsx` 场景（占绝大多数）正确；多端共享 config 的精确处理
 * 归后续（与 SWC / 多端解析一并，见 P4）。
 */
export function resolvePageConfigPath(pageFilePath: string): string | undefined {
  const ext = path.extname(pageFilePath)
  // 去掉脚本后缀，拼 `.config` 交给 resolveScriptPath 补 .ts/.js 等实际后缀。
  const base = pageFilePath.slice(0, -ext.length) + '.config'
  const resolved = resolveScriptPath(base)
  return fs.existsSync(resolved) ? resolved : undefined
}

/** 页面级 config 读取结果，区分"无文件/成功/读取失败"三态。 */
export interface PageConfigResult {
  /** 读到的 config（无文件或失败时为 undefined）。 */
  config?: PageConfig
  /** 文件存在但解析抛错。 */
  failed: boolean
  /** 失败时的错误信息。 */
  error?: string
}

/**
 * 读取页面级 config 内容（page/index.config.ts 的默认导出）。
 * 复用 helper readConfig 求值。区分三态：无 config 文件（config=undefined, failed=false）、
 * 读取成功（config 有值）、解析失败（failed=true + error）——失败信号交由调用方记 warning，
 * 避免把损坏的 config 静默当成空配置。
 *
 * @param alias 路径别名 map，透传给 readConfig 的 esbuild（与 app.config 同源）。
 */
export function readPageConfigContent(configFilePath: string, alias: Record<string, unknown> = {}): PageConfigResult {
  if (!fs.existsSync(configFilePath)) return { failed: false }
  try {
    const content = readConfig(configFilePath, { alias })
    return { config: (content ?? {}) as PageConfig, failed: false }
  } catch (err) {
    return { failed: true, error: (err as Error).message }
  }
}
