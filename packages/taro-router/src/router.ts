/* eslint-disable dot-notation */
import UniversalRouter, { Routes } from 'universal-router'
import { Listener as LocationListener, Action as LocationAction } from 'history'
import { createPageConfig, Current, eventCenter, container, SERVICE_IDENTIFIER, stringify, requestAnimationFrame } from '@tarojs/runtime'
import { qs } from './qs'
import { history, prependBasename } from './history'
import { stacks } from './stack'
import { init, routerConfig } from './init'
import { bindPageScroll } from './scroll'
import { setRoutesAlias, addLeadingSlash, historyBackDelta, setHistoryBackDelta, throttle, isTabBar, stripBasename } from './utils'

import type { AppConfig, PageConfig } from '@tarojs/taro'
import type { PageInstance, AppInstance, IHooks } from '@tarojs/runtime'

export interface Route extends PageConfig {
  path?: string
  load?: () => Promise<any>
}

interface H5RouterAnimate {
  /**
   * 动画切换时间，单位毫秒，默认300
   */
  animateTime: number
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
  PullDownRefresh?: any,
  /**
   * 是否开启h5端路由动画功能，默认关闭
   */
  h5RouterAnimate?: H5RouterAnimate | boolean
}

let appConfig: RouterConfig

function animateOpen () {
  return !!appConfig?.h5RouterAnimate
}

function animateTime () {
  return typeof appConfig?.h5RouterAnimate === 'object'
    ? appConfig?.h5RouterAnimate?.animateTime || 300
    : 300
}

function hidePage (page: PageInstance | null) {
  if (page != null) {
    page.onHide!()
    const pageEl = document.getElementById(page.path!)
    if (!pageEl) {
      return
    }
    if (animateOpen()) {
      setTimeout(() => {
        pageEl.style.display = 'none'
      }, animateTime())
    } else {
      pageEl!.style.display = 'none'
    }
  }
}

function showPage (page: PageInstance | null, pageConfig: Route | undefined, stacksIndex = 0) {
  if (page != null) {
    page.onShow!()
    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = ''
    } else {
      page.onLoad(qs(stacksIndex))
      pageEl = document.getElementById(page.path!)
      pageOnReady(pageEl, page, false)
    }
    bindPageScroll(page, pageConfig || {})
    if (animateOpen() && pageEl) {
      setTimeout(() => {
        pageEl!.classList.add('taro_page_show')
      }, 5)
    }
  }
}

const topPageUnload = {
  clear () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.page?.onUnload()
      this.timer = null
    }
  },
  add (page: PageInstance) {
    this.clear()
    this.page = page
    const pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.classList.remove('taro_page_show')
    }
    this.timer = setTimeout(() => {
      page.onUnload()
      this.timer = null
      this.page = null
    }, 300)
  },
  timer: null,
  page: null
}

function unloadPage (page: PageInstance | null, topPage = false) {
  if (page != null) {
    stacks.pop()
    if (animateOpen() && topPage) {
      topPageUnload.add(page)
    } else {
      page.onUnload()
    }
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

function loadPage (page: PageInstance | null, pageConfig: Route | undefined, stacksIndex = 0) {
  if (page !== null) {
    let pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = ''
    } else {
      page.onLoad(qs(stacksIndex), function () {
        pageEl = document.getElementById(page.path!)
        pageOnReady(pageEl, page)
      })
    }
    stacks.push(page)
    page.onShow!()
    bindPageScroll(page, pageConfig || {})
    if (animateOpen() && pageEl) {
      setTimeout(() => {
        pageEl!.classList.add('taro_page_show')
      }, 5)
    }
  }
}

export function createRouter (
  app: AppInstance,
  config: RouterConfig,
  framework
) {
  appConfig = config

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

  const render: LocationListener = throttle(async ({ location, action }) => {
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
      unloadPage(Current.page, stacks.length > 1)
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
      loadPage(page, pageConfig, routerIndex)
    }
  }, 500)

  if (history.location.pathname === '/') {
    history.replace(prependBasename(routes[0].path as string + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow!(qs(stacks.length))

  return history.listen(render)
}
