import { AppConfig } from '@tarojs/taro'
import { initTabbar } from './tabbar'

export function init (config: AppConfig) {
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
