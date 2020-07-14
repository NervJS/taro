/* eslint-disable dot-notation */
import UniversalRouter, { Routes } from 'universal-router'
import { AppConfig, PageConfig } from '@tarojs/taro'
import { LocationListener, LocationState } from 'history'
import { createPageConfig, Current, PageInstance, eventCenter, CurrentReconciler, AppInstance, stringify } from '@tarojs/runtime'
import { qs } from './qs'
import { history } from './history'
import { stacks } from './stack'
import { init, routerConfig } from './init'

export interface Route extends PageConfig {
  path: string
  load: () => Promise<any>
}

export interface RouterConfig extends AppConfig {
  routes: Route[],
  router: {
    mode: 'hash' | 'browser'
    basename: 'string',
    customRoutes?: Record<string, string>,
    pathname: string
  }
}

function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
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

function showPage (page: PageInstance | null) {
  if (page != null) {
    page.onShow!()
    stacks.push(page)
    const pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'block'
    } else {
      page.onLoad(qs())
      pageOnReady(pageEl, page, false)
    }
  }
}

function unloadPage (page: PageInstance | null) {
  if (page != null) {
    page.onHide!()
    stacks.pop()
    page.onUnload()
  }
}

function pageOnReady (pageEl: Element | null, page: PageInstance, onLoad = false) {
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

function loadPage (page: PageInstance | null) {
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

  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
    const path = addLeadingSlash(route.path)
    routes.push({
      path: alias[path] ? alias[path] : path,
      action: route.load
    })
  }

  const router = new UniversalRouter(routes)
  app.onLaunch!()

  const render: LocationListener<LocationState> = async (location, action) => {
    routerConfig.router.pathname = location.pathname
    const element = await router.resolve(location.pathname)
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
      const prev = stacks.find(s => s.path === location.pathname)
      if (prev) {
        showPage(prev)
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
        enablePullDownRefresh ? CurrentReconciler.createPullDownComponent?.(el, location.pathname, framework) : el,
        location.pathname + stringify(qs()),
        {},
        config
      )
      loadPage(page)
    }
  }

  if (history.location.pathname === '/') {
    history.replace(routes[0].path as string)
  }

  render(history.location, 'PUSH')

  app.onShow!(qs())

  return history.listen(render)
}
