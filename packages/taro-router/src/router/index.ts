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
import { unloadPage, showPage, hidePage, loadPage } from './page'
import { qs } from './qs'
import { stacks } from './stack'
import { setRoutesAlias, addLeadingSlash, historyBackDelta, setHistoryBackDelta, isTabBar } from '../utils'

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
      unloadPage(Current.page)
      let delta = historyBackDelta
      while (delta-- > 1) {
        unloadPage(stacks.slice(-1)[0])
      }
      // 最终必须重置为 1
      setHistoryBackDelta(1)
      const prevIndex = stacks.reduceRight((p, s, i) => {
        if (p !== 0) return p
        else if (s.path === location.pathname + stringify(qs(i))) return i
        else return 0
      }, 0)
      const prev = stacks[prevIndex]
      if (prev) {
        showPage(prev, pageConfig, prevIndex)
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
        const prevIndex = stacks.findIndex((r) => {
          return r.path?.replace(/\?.*/g, '') === pathname
        })
        if (prevIndex > -1) {
          // tabbar 页且之前出现过，直接复用
          const prev = stacks[prevIndex]
          return showPage(prev, pageConfig, prevIndex)
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
