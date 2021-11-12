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

import { history, prependBasename, stripBasename } from '../history'
import { init, routerConfig } from './init'
import { hidePage, loadPage, showPage, unloadPage } from './page'
import { qs } from './qs'
import stacks from './stack'
import { addLeadingSlash, isTabBar, setRoutesAlias } from '../utils'

/**
 * TODO
 * - [ ] api 调用顺序执行
 * - [ ] 页面显示同步执行
 * - [ ] 页面生命周期控制
 * - [ ] 页面异常控制 （多页共存、漏页）
 * - [ ] TabBar 相关 API 修复
 */

export interface Route extends PageConfig {
  path?: string
  load?: () => Promise<any>
}

export interface RouterConfig extends AppConfig {
  routes: Route[],
  router: {
    mode: 'hash' | 'browser'
    basename: string,
    customRoutes?: Record<string, string>,
    pathname: string,
    forcePath?: string
  },
  PullDownRefresh?: any
}

export function createRouter (
  app: AppInstance,
  config: RouterConfig,
  framework
) {
  init(config)

  const routes: Routes = []
  const alias = config.router.customRoutes ?? {}
  const runtimeHooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

  setRoutesAlias(alias)
  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
    const path = addLeadingSlash(route.path)
    routes.push({
      path: alias[path] || path,
      action: route.load
    })
  }

  const basename = config.router.basename
  const router = new UniversalRouter(routes, { baseUrl: basename || '' })
  app.onLaunch!()

  const render: LocationListener = async ({ location, action }) => {
    routerConfig.router.pathname = location.pathname
    let element
    try {
      element = await router.resolve(config.router.forcePath || location.pathname)
    } catch (error) {
      if (error.status === 404) {
        app.onPageNotFound?.({
          path: location.pathname
        })
      } else {
        throw new Error(error)
      }
    }
    if (!element) return
    const pageConfig = config.routes.find(r => {
      const path = addLeadingSlash(r.path)
      return path === location.pathname || alias[path] === location.pathname
    })
    let enablePullDownRefresh = false

    eventCenter.trigger('__taroRouterChange', {
      toLocation: {
        path: location.pathname
      }
    })

    if (pageConfig) {
      document.title = pageConfig.navigationBarTitleText ?? document.title
      enablePullDownRefresh = pageConfig.enablePullDownRefresh!
    }

    let shouldLoad = false

    if (action === 'POP') {
      // NOTE: 浏览器事件退后多次时，该事件只会被触发一次
      const prevIndex = stacks.getPrevIndex(location.pathname)
      unloadPage(Current.page, stacks.delta)
      if (prevIndex > -1) {
        showPage(stacks.getItem(prevIndex), pageConfig, prevIndex)
      } else {
        shouldLoad = true
      }
    } else if (action === 'PUSH') {
      hidePage(Current.page)
      shouldLoad = true
    } else if (action === 'REPLACE') {
      if (isTabBar(config)) {
        hidePage(Current.page)

        const pathname = stripBasename(config.router.pathname, basename)
        const prevIndex = stacks.getPrevIndex(pathname)
        if (prevIndex > -1) {
          // NOTE: tabbar 页且之前出现过，直接复用
          return showPage(stacks.getItem(prevIndex), pageConfig, prevIndex)
        }
      } else {
        unloadPage(Current.page)
      }
      shouldLoad = true
    }

    if (shouldLoad) {
      const el = element.default ?? element
      const loadConfig = { ...pageConfig }
      delete loadConfig['path']
      delete loadConfig['load']

      const pathname = stripBasename(config.router.pathname, basename)
      const routerIndex = stacks.length

      const page = createPageConfig(
        enablePullDownRefresh ? runtimeHooks.createPullDownComponent?.(el, location.pathname, framework, routerConfig.PullDownRefresh) : el,
        pathname + stringify(qs(routerIndex)),
        {},
        loadConfig
      )
      return loadPage(page, pageConfig, routerIndex)
    }
  }

  if (history.location.pathname === '/') {
    history.replace(prependBasename(routes[0].path as string + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow!(qs(stacks.length))

  return history.listen(render)
}
