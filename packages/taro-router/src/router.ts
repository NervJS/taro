/* eslint-disable dot-notation */
import UniversalRouter, { Routes } from 'universal-router'
import { LocationListener, LocationState } from 'history'
import { createPageConfig, Current, eventCenter, container, SERVICE_IDENTIFIER, stringify, requestAnimationFrame } from '@tarojs/runtime'
import { qs } from './qs'
import { history } from './history'
import { stacks } from './stack'
import { init, routerConfig } from './init'
import { bindPageScroll } from './scroll'
import { setRoutesAlias, addLeadingSlash, historyBackDelta, setHistoryBackDelta } from './utils'

import type { AppConfig, PageConfig } from '@tarojs/taro'
import type { PageInstance, AppInstance, IHooks } from '@tarojs/runtime'

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

function hidePage (page: PageInstance | null) {
  if (page != null) {
    page.onHide!()
    const pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'none'
    }
  }
}

function showPage (page: PageInstance | null, pageConfig: Route | undefined) {
  if (page != null) {
    page.onShow!()
    const pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'block'
    } else {
      page.onLoad(qs())
      pageOnReady(pageEl, page, false)
    }
    bindPageScroll(page, pageConfig || {})
  }
}

function unloadPage (page: PageInstance | null) {
  if (page != null) {
    stacks.pop()
    page.onUnload()
  }
}

function pageOnReady (pageEl: Element | null, page: PageInstance, onLoad = true) {
  if (pageEl && !pageEl?.['__isReady']) {
    const el = pageEl.firstElementChild
    // eslint-disable-next-line no-unused-expressions
    el?.['componentOnReady']?.().then(() => {
      requestAnimationFrame(() => {
        page.onReady!()
        pageEl!['__isReady'] = true
      })
    })
    onLoad && (pageEl['__page'] = page)
  }
}

function loadPage (page: PageInstance | null, pageConfig: Route | undefined) {
  if (page !== null) {
    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'block'
    } else {
      page.onLoad(qs())
      requestAnimationFrame(() => {
        page.onReady!()
      })
      pageEl = document.getElementById(page.path!)
      pageOnReady(pageEl, page)
    }
    page.onShow!()
    bindPageScroll(page, pageConfig || {})
    stacks.push(page)
  }
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

  const router = new UniversalRouter(routes)
  app.onLaunch!()

  const render: LocationListener<LocationState> = async (location, action) => {
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
      const prev = stacks.find(s => s.path === location.pathname + stringify(qs()))
      if (prev) {
        showPage(prev, pageConfig)
      } else {
        shouldLoad = true
      }
    } else if (action === 'PUSH') {
      hidePage(Current.page)
      shouldLoad = true
    } else if (action === 'REPLACE') {
      unloadPage(Current.page)
      shouldLoad = true
    }

    if (shouldLoad) {
      const el = element.default ?? element
      const config = { ...pageConfig }
      delete config['path']
      delete config['load']
      const page = createPageConfig(
        enablePullDownRefresh ? runtimeHooks.createPullDownComponent?.(el, location.pathname, framework, routerConfig.PullDownRefresh) : el,
        location.pathname + stringify(qs()),
        {},
        config
      )
      loadPage(page, pageConfig)
    }
  }

  if (history.location.pathname === '/') {
    history.replace(routes[0].path as string + history.location.search)
  }

  render(history.location, 'PUSH')

  app.onShow!(qs())

  return history.listen(render)
}
