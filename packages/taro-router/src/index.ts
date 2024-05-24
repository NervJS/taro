import { initNavigationBar } from './navigationBar'
import { initTabbar } from './tabbar'

import type { History } from 'history'
import type { MpaRouterConfig, SpaRouterConfig } from '../types/router'

export * from './api'
export * from './history'
export { createMultiRouter } from './router/mpa'
export { createRouter } from './router/spa'
export * from './utils'

export function handleAppMount (config: SpaRouterConfig | MpaRouterConfig, _: History, appId = config.appId || 'app') {
  let app = document.getElementById(appId)
  let isPosition = true
  if (!app) {
    app = document.createElement('div')
    app.id = appId
    isPosition = false
  }
  const appWrapper = app?.parentNode || app?.parentElement || document.body
  app.classList.add('taro_router')

  if (!isPosition) appWrapper.appendChild(app)
  initNavigationBar(config, appWrapper as HTMLElement)
}

export function handleAppMountWithTabbar (config: SpaRouterConfig | MpaRouterConfig, history: History, appId = config.appId || 'app') {
  let app = document.getElementById(appId)
  let isPosition = true
  if (!app) {
    app = document.createElement('div')
    app.id = appId
    isPosition = false
  }
  const appWrapper = app?.parentNode || app?.parentElement || document.body
  app.classList.add('taro_router')

  const container = document.createElement('div')
  container.classList.add('taro-tabbar__container')
  container.id = 'container'

  const panel = document.createElement('div')
  panel.classList.add('taro-tabbar__panel')

  panel.appendChild(app.cloneNode(true))
  container.appendChild(panel)

  if (!isPosition) {
    appWrapper.appendChild(container)
  } else {
    appWrapper.replaceChild(container, app)
  }

  initTabbar(config, history)
  initNavigationBar(config, container)
}
