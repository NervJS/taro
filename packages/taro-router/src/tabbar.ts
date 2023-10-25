// @ts-nocheck
import { defineCustomElementTaroTabbar } from '@tarojs/components/dist/components'
import { AppConfig, initTabBarApis } from '@tarojs/taro'

import { history } from './history'

export function initTabbar (config: AppConfig) {
  if (config.tabBar == null) {
    return
  }

  // TODO: custom-tab-bar
  defineCustomElementTaroTabbar()
  const tabbar: any = document.createElement('taro-tabbar') as HTMLDivElement
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
  container?.appendChild(tabbar)
  initTabBarApis(config)
}
