import { initTabbar } from './tabbar'
import { setHistoryMode } from './history'
import { RouterConfig } from './router'

export function init (config: RouterConfig) {
  config.router.mode = config.router.mode || 'hash'
  setHistoryMode(config.router.mode, config.router.basename)
  Object.assign(routerConfig, config)
  document.getElementById('app')?.remove()

  const panel = document.createElement('div')
  panel.classList.add('taro-tabbar__panel')

  const app = document.createElement('div')
  app.id = 'app'
  app.classList.add('taro_router')

  panel.appendChild(app)
  document.body.appendChild(panel)

  initTabbar(config, panel)
}

export const routerConfig: RouterConfig = Object.create(null)
