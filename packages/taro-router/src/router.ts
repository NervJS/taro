import UniversalRouter, { Routes } from 'universal-router'
import { AppConfig, PageConfig } from '@tarojs/taro'
import { LocationListener, LocationState } from 'history'
import { createReactApp, createPageConfig, Current, createVueApp, PageInstance } from '@tarojs/runtime'
import { qs } from './qs'
import { history } from './history'
import { stacks } from './stack'

interface Route extends PageConfig {
  path: string
  load: () => Promise<any>
}

interface RouterConfig extends AppConfig {
  routes: Route[]
}

let prevPage: PageInstance | null = null

function addLeadingSlash (path?: string) {
  if (path == null) {
    return ''
  }
  return path.charAt(0) === '/' ? path : '/' + path
}

function hidePage (page: PageInstance | null) {
  if (page != null) {
    page.onHide!()
    prevPage = stacks.pop()!
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
    }
  }
}

function unloadPage (page: PageInstance | null) {
  if (page != null) {
    page.onHide!()
    prevPage = stacks.pop()!
    page.onUnload()
  }
}

function loadPage (page: PageInstance | null) {
  if (page !== null) {
    const pageEl = document.getElementById(page.path!)
    if (pageEl) {
      pageEl.style.display = 'block'
    } else {
      page.onLoad(qs())
    }
    page.onShow!()
    stacks.push(page)
  }
}

export function createRouter (App, config: RouterConfig, framework: 'react' | 'vue' | 'nerv') {
  const routes: Routes = []

  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
    routes.push({
      path: addLeadingSlash(route.path),
      action: route.load
    })
  }

  const router = new UniversalRouter(routes)
  const app = framework === 'react' ? createReactApp(App) : createVueApp(App)
  app.onLaunch()

  const render: LocationListener<LocationState> = async (location, action) => {
    const element = await router.resolve(location.pathname)
    const pageConfig = config.routes.find(r => addLeadingSlash(r.path) === location.pathname)

    if (pageConfig) {
      document.title = pageConfig.navigationBarTitleText ?? document.title
    }

    if (action === 'POP') {
      const prev = prevPage
      unloadPage(Current.page)
      showPage(prev)
    } else if (action === 'PUSH') {
      hidePage(Current.page)
      const page = createPageConfig(element.default ?? element, location.pathname)
      loadPage(page)
    } else if (action === 'REPLACE') {
      unloadPage(Current.page)
      const page = createPageConfig(element.default ?? element, location.pathname)
      loadPage(page)
    }
  }

  if (history.location.pathname === '/') {
    history.replace(config.pages![0])
  }

  render(history.location, 'PUSH')

  app.onShow!(qs())

  return history.listen(render)
}
