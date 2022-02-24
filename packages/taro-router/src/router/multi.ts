/* eslint-disable dot-notation */
import {
  AppInstance,
  container, createPageConfig,
  eventCenter, IHooks,
  SERVICE_IDENTIFIER, stringify
} from '@tarojs/runtime'
import type { AppConfig } from '@tarojs/taro'
import { IH5RouterConfig } from '@tarojs/taro/types/compile'
import { Route } from '.'
import MultiPageHandler from './multi-page'

export interface MultiRouterConfig extends AppConfig {
  route: Route,
  pageName: string
  router: {
    mode: IH5RouterConfig['mode']
    basename: string
    customRoutes?: Record<string, string | string[]>
    pathname: string
    forcePath?: string
  }
  // 下拉刷新组件
  PullDownRefresh?: any
}

// TODO 支持多路由 (APP 生命周期仅触发一次)
/** Note: 关于多页面应用
 * - 需要配置路由映射（根目录跳转、404 页面……）
 * - app.onPageNotFound 事件不支持
 * - 应用生命周期可能多次触发
 * - TabBar 会多次加载
 * - 不支持路由动画
 */

export async function createMultiRouter (
  app: AppInstance,
  config: MultiRouterConfig,
  framework?: string
) {
  const handler = new MultiPageHandler(config)
  const runtimeHooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)
  const launchParam = handler.getQuery()
  app.onLaunch?.(launchParam)

  const pathName = config.pageName
  const pageConfig = handler.pageConfig
  let element
  try {
    element = await pageConfig.load?.()
  } catch (error) {
    throw new Error(error)
  }
  if (!element) return
  let enablePullDownRefresh = config?.window?.enablePullDownRefresh || false

  eventCenter.trigger('__taroRouterChange', {
    toLocation: {
      path: pathName
    }
  })

  if (pageConfig) {
    document.title = pageConfig.navigationBarTitleText ?? document.title
    if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
      enablePullDownRefresh = pageConfig.enablePullDownRefresh
    }
  }

  const el = element.default ?? element
  const loadConfig = { ...pageConfig }
  delete loadConfig['path']
  delete loadConfig['load']
  const page = createPageConfig(
    enablePullDownRefresh ? runtimeHooks.createPullDownComponent?.(el, location.pathname, framework, config.PullDownRefresh) : el,
    pathName + stringify(launchParam),
    {},
    loadConfig
  )
  handler.load(page, pageConfig)

  app.onShow?.(launchParam)
}
