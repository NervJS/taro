import { initTabbar } from './tabbar'
import { setHistoryMode } from './history'
import { RouterConfig } from './router'

export function init (config: RouterConfig) {
  setHistoryMode(config.router.mode, config.router.basename)
  Object.assign(routerConfig, config)
  // eslint-disable-next-line no-unused-expressions
  document.getElementById('app')?.remove()

  const container = document.createElement('div')
  container.classList.add('taro-tabbar__container')
  container.id = 'container'

  const panel = document.createElement('div')
  panel.classList.add('taro-tabbar__panel')

  const app = document.createElement('div')
  app.id = 'app'
  app.classList.add('taro_router')

  panel.appendChild(app)
  container.appendChild(panel)

  document.body.appendChild(container)

  initTabbar(config)
}

export const routerConfig: RouterConfig = Object.create({})
