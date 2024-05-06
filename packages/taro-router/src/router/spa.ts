/* eslint-disable dot-notation */
import {
  addLeadingSlash,
  createPageConfig, Current,
  eventCenter, hooks,
  incrementId,
  safeExecute,
  stringify, stripBasename,
} from '@tarojs/runtime'
import { Action as LocationAction } from 'history'
import UniversalRouter from 'universal-router'

import { prependBasename } from '../history'
import { routesAlias } from '../utils'
import { RouterConfig } from '.'
import PageHandler from './page'
import stacks from './stack'

import type { AppInstance } from '@tarojs/runtime'
import type { History, Listener as LocationListener } from 'history'
import type { Routes } from 'universal-router'
import type { SpaRouterConfig } from '../../types/router'

const createStampId = incrementId()
let launchStampId = createStampId()

export function createRouter (
  history: History,
  app: AppInstance,
  config: SpaRouterConfig,
  framework?: string
) {
  if (typeof app.onUnhandledRejection === 'function') {
    window.addEventListener('unhandledrejection', app.onUnhandledRejection)
  }
  RouterConfig.config = config
  const handler = new PageHandler(config, history)

  routesAlias.set(handler.router.customRoutes)
  const basename = handler.router.basename
  const routes: Routes = handler.routes.map(route => {
    const routePath = addLeadingSlash(route.path)
    const paths = routesAlias.getAll(routePath)
    return {
      path: paths.length < 1 ? routePath : paths,
      action: route.load
    }
  })
  const router = new UniversalRouter(routes, { baseUrl: basename || '' })
  const launchParam: Taro.getLaunchOptionsSync.LaunchOptions = {
    path: handler.currentPage,
    query: handler.getQuery(launchStampId),
    scene: 0,
    shareTicket: '',
    referrerInfo: {}
  }

  eventCenter.trigger('__taroRouterLaunch', launchParam)
  app.onLaunch?.(launchParam as Record<string, any>)
  app.onError && window.addEventListener('error', e => app.onError?.(e.message))

  const render: LocationListener = async ({ location, action }) => {
    handler.pathname = decodeURI(location.pathname)

    if ((window as any).__taroAppConfig?.usingWindowScroll) window.scrollTo(0, 0)
    eventCenter.trigger('__taroRouterChange', {
      toLocation: {
        path: handler.pathname
      }
    })

    let element, params
    try {
      const result = await router.resolve(handler.router.forcePath || handler.pathname)
      ;[element, , params] = await Promise.all(result)
    } catch (error) {
      if (error.status === 404) {
        const notFoundEvent = {
          isEntryPage: stacks.length === 0,
          path: handler.pathname,
          query: handler.getQuery(createStampId()),
        }
        app.onPageNotFound?.(notFoundEvent)
        eventCenter.trigger('__taroRouterNotFound', notFoundEvent)
      } else if (/Loading hot update .* failed./.test(error.message)) {
        // NOTE: webpack5 与 prebundle 搭配使用时，开发环境下初次启动时偶发错误，由于 HMR 加载 chunk hash 错误，导致热更新失败
        window.location.reload()
      } else {
        throw error
      }
    }
    if (!element) return
    const pageConfig = handler.pageConfig
    let enablePullDownRefresh = config?.window?.enablePullDownRefresh || false
    let navigationStyle = config?.window?.navigationStyle || 'default'
    let navigationBarTextStyle = config?.window?.navigationBarTextStyle || 'white'
    let navigationBarBackgroundColor = config?.window?.navigationBarBackgroundColor || '#000000'

    if (pageConfig) {
      if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
        enablePullDownRefresh = pageConfig.enablePullDownRefresh
      }
      if (typeof pageConfig.navigationStyle === 'string') {
        navigationStyle = pageConfig.navigationStyle
      }
      if (typeof pageConfig.navigationBarTextStyle === 'string') {
        navigationBarTextStyle = pageConfig.navigationBarTextStyle
      }
      if (typeof pageConfig.navigationBarBackgroundColor === 'string') {
        navigationBarBackgroundColor = pageConfig.navigationBarBackgroundColor
      }
    }
    eventCenter.trigger('__taroSetNavigationStyle', navigationStyle, navigationBarTextStyle, navigationBarBackgroundColor)

    const currentPage = Current.page
    const pathname = handler.pathname
    const methodName = stacks.method ?? ''
    const cacheTabs = stacks.getTabs()
    let shouldLoad = false
    stacks.method = ''

    if (methodName === 'reLaunch') {
      handler.unload(currentPage, stacks.length)
      // NOTE: 同时卸载缓存在tabs里面的页面实例
      for (const key in cacheTabs) {
        if (cacheTabs[key]) {
          handler.unload(cacheTabs[key])
          stacks.removeTab(key)
        }
      }
      shouldLoad = true
    } else if (currentPage && handler.isTabBar(handler.pathname)) {
      if (handler.isSamePage(currentPage)) return
      if (handler.isTabBar(currentPage!.path!)) {
        handler.hide(currentPage)
        stacks.pushTab(currentPage!.path!.split('?')[0])
      } else if (stacks.length > 0) {
        const firstIns = stacks.getItem(0)
        if (handler.isTabBar(firstIns.path!)) {
          handler.unload(currentPage, stacks.length - 1, true)
          stacks.pushTab(firstIns.path!.split('?')[0])
        } else {
          handler.unload(currentPage, stacks.length, true)
        }
      }

      if (cacheTabs[handler.pathname]) {
        stacks.popTab(handler.pathname)
        return handler.show(stacks.getItem(0), pageConfig, 0)
      }
      shouldLoad = true
    } else if (action === 'POP') {
      // NOTE: 浏览器事件退后多次时，该事件只会被触发一次
      const prevIndex = stacks.getPrevIndex(pathname)
      const delta = stacks.getDelta(pathname)
      // NOTE: Safari 内核浏览器在非应用页面返回上一页时，会触发额外的 POP 事件，此处需避免当前页面被错误卸载
      if (currentPage !== stacks.getItem(prevIndex)) {
        handler.unload(currentPage, delta, prevIndex > -1)
        if (prevIndex > -1) {
          eventCenter.once('__taroPageOnShowAfterDestroyed', () => {
            handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
          })
        } else {
          shouldLoad = true
        }
      }
    } else if (action === 'REPLACE') {
      const delta = stacks.getDelta(pathname)
      // NOTE: 页面路由记录并不会清空，只是移除掉缓存的 stack 以及页面
      handler.unload(currentPage, delta)
      shouldLoad = true
    } else if (action === 'PUSH') {
      handler.hide(currentPage)
      shouldLoad = true
    }

    if (shouldLoad || stacks.length < 1) {
      const el = element.default ?? element
      const loadConfig = { ...pageConfig }
      const stacksIndex = stacks.length
      delete loadConfig['path']
      delete loadConfig['load']

      let pageStampId = ''
      if (launchStampId) {
        pageStampId = launchStampId
        launchStampId = ''
      } else {
        pageStampId = createStampId()
      }

      const page = createPageConfig(
        enablePullDownRefresh ? hooks.call('createPullDownComponent', el, pathname, framework, handler.PullDownRefresh, pageStampId) : el,
        pathname + stringify(handler.getQuery(pageStampId)),
        {},
        loadConfig
      )
      if (params) page.options = params
      handler.load(page, pageConfig, pageStampId, stacksIndex)
    }
  }

  const routePath = addLeadingSlash(stripBasename(history.location.pathname, handler.basename))
  if (routePath === '/') {
    history.replace(prependBasename(handler.homePage + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow?.(launchParam as Record<string, any>)

  window.addEventListener('visibilitychange', () => {
    const currentPath = Current.page?.path || ''
    const path = currentPath.substring(0, currentPath.indexOf('?'))
    const param = {}
    // app的 onShow/onHide 生命周期的路径信息为当前页面的路径
    Object.assign(param, launchParam, { path })
    if (document.visibilityState === 'visible') {
      app.onShow?.(param as Record<string, any>)
      // 单页面app显示后一刻会触发当前 page.onShow 生命周期函数
      Current.page?.onShow?.()
    } else {
      // 单页面app隐藏前一刻会触发当前 page.onHide 生命周期函数
      if (Current.page?.path) {
        safeExecute(Current.page?.path, 'onHide')
      }
      app.onHide?.(param as Record<string, any>)
    }
  })

  return history.listen(render)
}
