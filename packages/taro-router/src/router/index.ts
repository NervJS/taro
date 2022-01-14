/* eslint-disable dot-notation */
import {
  AppInstance,
  container, createPageConfig, Current,
  eventCenter, IHooks,
  SERVICE_IDENTIFIER, stringify
} from '@tarojs/runtime'
import type { AppConfig, PageConfig } from '@tarojs/taro'
import { Listener as LocationListener, Action as LocationAction } from 'history'
import UniversalRouter, { Routes } from 'universal-router'

import { history, prependBasename } from '../history'
import PageHandler from './page'
import stacks from './stack'
import { addLeadingSlash, routesAlias } from '../utils'

export interface Route extends PageConfig {
  path?: string
  load?: () => Promise<any>
}

export interface RouterConfig extends AppConfig {
  routes: Route[],
  router: {
    mode: 'hash' | 'browser'
    basename: string
    customRoutes?: Record<string, string | string[]>
    pathname: string
    forcePath?: string
  }
  // 下拉刷新组件
  PullDownRefresh?: any
}

export function createRouter (
  app: AppInstance,
  config: RouterConfig,
  framework?: string
) {
  const handler = new PageHandler(config)

  const runtimeHooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

  routesAlias.set(handler.router.customRoutes)
  const basename = handler.router.basename
  const routes: Routes = handler.routes.map(route => ({
    path: routesAlias.getAll(addLeadingSlash(route.path)),
    action: route.load
  }))
  const entryPagePath: string = config.entryPagePath || routes[0].path?.[0]
  const router = new UniversalRouter(routes, { baseUrl: basename || '' })
  const launchParam = handler.getQuery(stacks.length)
  app.onLaunch?.(launchParam)

  const render: LocationListener = async ({ location, action }) => {
    handler.pathname = location.pathname
    let element
    try {
      element = await router.resolve(handler.router.forcePath || handler.pathname)
    } catch (error) {
      if (error.status === 404) {
        app.onPageNotFound?.({
          path: handler.pathname
        })
      } else {
        throw new Error(error)
      }
    }
    if (!element) return
    const pageConfig = handler.pageConfig
    let enablePullDownRefresh = false

    eventCenter.trigger('__taroRouterChange', {
      toLocation: {
        path: handler.pathname
      }
    })

    if (pageConfig) {
      document.title = pageConfig.navigationBarTitleText ?? document.title
      enablePullDownRefresh = pageConfig.enablePullDownRefresh!
    }

    const currentPage = Current.page
    const pathname = handler.pathname
    let shouldLoad = false

    if (action === 'POP') {
      // NOTE: 浏览器事件退后多次时，该事件只会被触发一次
      const prevIndex = stacks.getPrevIndex(pathname)
      const delta = stacks.getDelta(pathname)
      handler.unload(currentPage, delta, prevIndex > -1)
      if (prevIndex > -1) {
        handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
      } else {
        shouldLoad = true
      }
    } else {
      if (handler.isTabBar) {
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
        enablePullDownRefresh ? runtimeHooks.createPullDownComponent?.(el, location.pathname, framework, handler.PullDownRefresh) : el,
        pathname + stringify(handler.getQuery(stacksIndex)),
        {},
        loadConfig
      )
      return handler.load(page, pageConfig, stacksIndex)
    }
  }

  if (history.location.pathname === '/') {
    history.replace(prependBasename(entryPagePath + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow?.(launchParam)

  return history.listen(render)
}
