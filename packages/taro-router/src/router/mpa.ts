/* eslint-disable dot-notation */
import {
  createPageConfig,
  eventCenter, hooks,
  incrementId,
  stringify,
} from '@tarojs/runtime'

import { setTitle } from '../utils/navigate'
import { RouterConfig } from '.'
import MultiPageHandler from './multi-page'

import type { AppInstance } from '@tarojs/runtime'
import type { MpaRouterConfig } from '../../types/router'

const createStampId = incrementId()
const launchStampId = createStampId()

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
  if (typeof app.onUnhandledRejection === 'function') {
    window.addEventListener('unhandledrejection', app.onUnhandledRejection)
  }
  RouterConfig.config = config
  const handler = new MultiPageHandler(config)
  const launchParam: Taro.getLaunchOptionsSync.LaunchOptions = {
    path: config.pageName, // 多页面模式没新开一个页面相当于重启，所以直接使用当前页面路径
    query: handler.getQuery(launchStampId),
    scene: 0,
    shareTicket: '',
    referrerInfo: {}
  }

  eventCenter.trigger('__taroRouterLaunch', launchParam)
  app.onLaunch?.(launchParam as Record<string, any>)
  app.onError && window.addEventListener('error', e => app.onError?.(e.message))

  const pathName = config.pageName
  const pageConfig = handler.pageConfig
  eventCenter.trigger('__taroRouterChange', {
    toLocation: {
      path: pathName
    }
  })

  let element
  try {
    element = await pageConfig.load?.()
    if (element instanceof Array) {
      element = element[0]
    }
  } catch (error) {
    throw new Error(error)
  }
  if (!element) return
  let enablePullDownRefresh = config?.window?.enablePullDownRefresh || false

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
    enablePullDownRefresh ? hooks.call('createPullDownComponent', el, pathName, framework, handler.PullDownRefresh) : el,
    pathName + stringify(launchParam as Record<string, any>),
    {},
    loadConfig
  )
  handler.load(page, pageConfig)

  app.onShow?.(launchParam as Record<string, any>)
}
