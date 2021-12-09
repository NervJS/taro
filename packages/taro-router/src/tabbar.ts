import { AppConfig } from '@tarojs/taro'
import { history } from './history'

const Taro = require('@tarojs/taro-h5')

export function initTabbar (config: AppConfig) {
  if (config.tabBar == null) {
    return
  }

  // TODO: 找到 tabbar 的类型
  const tabbar = document.createElement('taro-tabbar') as any
  const homePage = config.entryPagePath || (config.pages ? config.pages[0] : '')
  tabbar.conf = config.tabBar
  tabbar.conf.homePage = history.location.pathname === '/' ? homePage : history.location.pathname
  const routerConfig = (config as any).router
  tabbar.conf.mode = routerConfig && routerConfig.mode ? routerConfig.mode : 'hash'
  if (routerConfig.customRoutes) {
    tabbar.conf.custom = true
    tabbar.conf.customRoutes = routerConfig.customRoutes
  } else {
    tabbar.conf.custom = false
    tabbar.conf.customRoutes = {}
  }
  if (typeof routerConfig.basename !== 'undefined') {
    tabbar.conf.basename = routerConfig.basename
  }
  const container = document.getElementById('container')
  // eslint-disable-next-line no-unused-expressions
  container?.appendChild(tabbar)
  Taro.initTabBarApis(config)
}
