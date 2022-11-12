/* eslint-disable dot-notation */
import {
  AppInstance,
  createPageConfig, Current,
  eventCenter, hooks,
  stringify
} from '@tarojs/runtime'
import { Action as LocationAction, Listener as LocationListener } from 'history'
import UniversalRouter, { Routes } from 'universal-router'

import { history, prependBasename } from '../history'
import { addLeadingSlash, routesAlias, stripBasename } from '../utils'
import { setTitle } from '../utils/navigate'
import { RouterConfig } from '.'
import PageHandler from './page'
import stacks from './stack'

import type { SpaRouterConfig } from '../../types/router'

export function createRouter (
  app: AppInstance,
  config: SpaRouterConfig,
  framework?: string
) {
  RouterConfig.config = config
  const handler = new PageHandler(config)

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
    path: handler.homePage,
    query: handler.getQuery(stacks.length),
    scene: 0,
    shareTicket: '',
    referrerInfo: {}
  }

  eventCenter.trigger('__taroRouterLaunch', launchParam)
  app.onLaunch?.(launchParam as Record<string, any>)
  app.onError && window.addEventListener('error', e => app.onError?.(e.message))

  const render: LocationListener = async ({ location, action }) => {
    handler.pathname = decodeURI(location.pathname)
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
        app.onPageNotFound?.({
          path: handler.pathname
        })
      } else if (/Loading hot update .* failed./.test(error.message)) {
        // NOTE: webpack5 与 prebundle 搭配使用时，开发环境下初次启动时偶发错误，由于 HMR 加载 chunk hash 错误，导致热更新失败
        window.location.reload()
      } else {
        throw new Error(error)
      }
    }
    if (!element) return
    const pageConfig = handler.pageConfig
    let enablePullDownRefresh = config?.window?.enablePullDownRefresh || false

    if (pageConfig) {
      document.title = pageConfig.navigationBarTitleText ?? document.title
      setTitle(pageConfig.navigationBarTitleText ?? document.title)
      if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
        enablePullDownRefresh = pageConfig.enablePullDownRefresh
      }
    }

    const currentPage = Current.page
    const pathname = handler.pathname
    const methodName = stacks.method ?? ''
    let shouldLoad = false
    // 拷贝之后清空掉，因为浏览器左上角的返回前进不会有methodName
    stacks.method = ''

    if (action === 'POP') {
      // NOTE: 浏览器事件退后多次时，该事件只会被触发一次
      const prevIndex = stacks.getPrevIndex(pathname)
      const delta = stacks.getDelta(pathname)
      // NOTE: Safari 内核浏览器在非应用页面返回上一页时，会触发额外的 POP 事件，此处需避免当前页面被错误卸载
      if (currentPage !== stacks.getItem(prevIndex)) {
        handler.unload(currentPage, delta, prevIndex > -1)
        if (prevIndex > -1) {
          handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
        } else {
          shouldLoad = true
        }
      }
    } else {
      // 卸载所有页面，然后重新加载新页面
      if (methodName === 'reLaunch') {
        // NOTE: 页面路由记录并不会清空，只是移除掉缓存的 stack 以及页面
        handler.unload(currentPage, stacks.length)
      } else if (handler.isTabBar) {
        if (handler.isSamePage(currentPage)) return
        const prevIndex = stacks.getPrevIndex(pathname, 0)
        handler.hide(currentPage)
        if (prevIndex > -1) {
          // NOTE: tabbar 页且之前出现过，直接复用
          return handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
        }
      } else if (action === 'REPLACE') {
        const delta = stacks.getDelta(pathname)
        // NOTE: 页面路由记录并不会清空，只是移除掉缓存的 stack 以及页面
        handler.unload(currentPage, delta)
      } else if (action === 'PUSH') {
        handler.hide(currentPage)
      }
      shouldLoad = true
    }

    if (shouldLoad || stacks.length < 1) {
      const el = element.default ?? element
      const loadConfig = { ...pageConfig }
      const stacksIndex = stacks.length
      delete loadConfig['path']
      delete loadConfig['load']

      const page = createPageConfig(
        enablePullDownRefresh ? hooks.call('createPullDownComponent', el, location.pathname, framework, handler.PullDownRefresh) : el,
        pathname + stringify(handler.getQuery(stacksIndex)),
        {},
        loadConfig
      )
      if (params) page.options = params
      return handler.load(page, pageConfig, stacksIndex)
    }
  }

  const routePath = addLeadingSlash(stripBasename(history.location.pathname, handler.basename))
  if (routePath === '/') {
    history.replace(prependBasename(handler.homePage + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow?.(launchParam as Record<string, any>)

  return history.listen(render)
}
