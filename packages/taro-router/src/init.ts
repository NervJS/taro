import { initTabbar } from './tabbar'
import { setHistoryMode } from './history'
import { RouterConfig } from './router'

export const routerConfig: RouterConfig = Object.create(null)

export function init (config: RouterConfig) {
  config.router.mode = config.router.mode || 'hash'
  setHistoryMode(config.router.mode, config.router.basename)
  Object.assign(routerConfig, config)

  let app = document.getElementById(config.h5RenderDomId || 'app')
  if (!app) {
    app = document.createElement('div')
    app.id = config.h5RenderDomId || 'app'
    document.body.appendChild(app)
  }
  app.classList.add('taro_router')

  if (config.tabBar != null) {
    const container = document.createElement('div')
    container.classList.add('taro-tabbar__container')

    const panel = document.createElement('div')
    panel.classList.add('taro-tabbar__panel')

    panel.appendChild(app)
    container.appendChild(panel)

    document.body.appendChild(container)

    initTabbar(config, container)
  }
}
