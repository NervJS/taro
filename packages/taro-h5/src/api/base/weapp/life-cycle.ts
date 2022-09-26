import Taro from '@tarojs/api'

const launchOptions: Taro.getLaunchOptionsSync.LaunchOptions = {
  path: '',
  query: {},
  scene: 0,
  shareTicket: '',
  referrerInfo: {}
}

function initLaunchOptions (options = {}) {
  Object.assign(launchOptions, options)
}

Taro.eventCenter.once('__taroRouterLaunch', initLaunchOptions)

// 生命周期
export const getLaunchOptionsSync: typeof Taro.getLaunchOptionsSync = () => launchOptions
export const getEnterOptionsSync: typeof Taro.getEnterOptionsSync = () => launchOptions
