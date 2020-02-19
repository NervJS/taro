import UniversalRouter, { Routes } from 'universal-router'
import { LocationListener, LocationState } from 'history'
import { createReactApp, createPageConfig, Current, createVueApp, PageInstance } from '@tarojs/runtime'
import { qs } from './qs'
import { history } from './history'
import { stacks } from './stack'

let prevPage: PageInstance | null = null

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

export function createRouter (App, routes: Routes, framework: 'react' | 'vue' | 'nerv') {
  const router = new UniversalRouter(routes)
  const app = framework === 'react' ? createReactApp(App) : createVueApp(App)
  app.onLaunch()

  const render: LocationListener<LocationState> = async (location, action) => {
    const element = await router.resolve(location.pathname)

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

  render(history.location, 'PUSH')

  return history.listen(render)
}
