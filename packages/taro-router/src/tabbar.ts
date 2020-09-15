import { AppConfig } from '@tarojs/taro'
import { history } from './history'

export function initTabbar (config: AppConfig) {
  if (config.tabBar == null) {
    return
  }

  // TODO: 找到 tabbar 的类型
  const tabbar = document.createElement('taro-tabbar') as any
  const homePage = config.pages ? config.pages[0] : ''
  tabbar.conf = config.tabBar
  tabbar.conf.homePage = history.location.pathname === '/' ? homePage : history.location.pathname
  const routerConfig = (config as any).router
  tabbar.conf.mode = routerConfig && routerConfig.mode ? routerConfig.mode : 'hash'
  const container = document.getElementById('container')
  // eslint-disable-next-line no-unused-expressions
  container?.appendChild(tabbar)
}
