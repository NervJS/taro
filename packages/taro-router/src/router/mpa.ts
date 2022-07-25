/* eslint-disable dot-notation */
import {
  AppInstance,
  createPageConfig,
  eventCenter, hooks,
  stringify
} from '@tarojs/runtime'
import { setTitle } from '@tarojs/taro-h5/dist/utils/navigate'

import type { MpaRouterConfig } from '../../types/router'
import { RouterConfig } from '.'
import MultiPageHandler from './multi-page'

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
  config: MpaRouterConfig,
  framework?: string
) {
  RouterConfig.config = config
  const handler = new MultiPageHandler(config)
  const launchParam = handler.getQuery()
  app.onLaunch?.(launchParam)
  app.onError && window.addEventListener('error', e => app.onError?.(e.message))

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
    setTitle(pageConfig.navigationBarTitleText ?? document.title)
    if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
      enablePullDownRefresh = pageConfig.enablePullDownRefresh
    }
  }

  const el = element.default ?? element
  const loadConfig = { ...pageConfig }
  delete loadConfig['path']
  delete loadConfig['load']
  const page = createPageConfig(
    enablePullDownRefresh ? hooks.call('createPullDownComponent', el, location.pathname, framework, config.PullDownRefresh) : el,
    pathName + stringify(launchParam),
    {},
    loadConfig
  )
  handler.load(page, pageConfig)

  app.onShow?.(launchParam)
}
