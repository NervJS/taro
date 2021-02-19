import Taro, { AppConfig } from '@tarojs/taro'
import { history } from './history'

export function initTabbar (config: AppConfig, panel: HTMLElement) {
  if (config.tabBar == null) {
    return
  }

  const position = config.tabBar.position || 'bottom'
  const targetClass = position === 'bottom' ? 'taro-tabbar__panel-bottom' : 'taro-tabbar__panel-top'
  panel.classList.add(targetClass)

  Taro.eventCenter.on('__taroShowTabBar', () => {
    panel.classList.add(targetClass)
  })
  Taro.eventCenter.on('__taroHideTabBar', () => {
    panel.classList.remove(targetClass)
  })

  // TODO: 找到 tabbar 的类型
  const tabbar = document.createElement('taro-tabbar') as any
  const homePage = config.pages ? config.pages[0] : ''
  tabbar.conf = config.tabBar
  tabbar.conf.homePage = history.location.pathname === '/' ? homePage : history.location.pathname
  const routerConfig = (config as any).router
  tabbar.conf.mode = routerConfig && routerConfig.mode ? routerConfig.mode : 'hash'
  tabbar.conf.custom = !!routerConfig.customRoutes
  if (routerConfig.customRoutes) {
    tabbar.conf.custom = true
    tabbar.conf.customRoutes = routerConfig.customRoutes
  } else {
    tabbar.conf.custom = false
    tabbar.conf.customRoutes = {}
  }
  const container = document.body
  // eslint-disable-next-line no-unused-expressions
  container?.appendChild(tabbar)
}
