import { AppConfig } from '@tarojs/taro'

export function initTabbar (config: AppConfig) {
  if (config.tabBar == null) {
    return
  }

  // TODO: 找到 tabbar 的类型
  const tabbar = document.createElement('taro-tabbar') as any
  tabbar.conf = config.tabBar
  const container = document.getElementById('container')
  // eslint-disable-next-line no-unused-expressions
  container?.appendChild(tabbar)
}
