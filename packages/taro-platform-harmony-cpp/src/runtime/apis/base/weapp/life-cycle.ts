import { eventCenter } from '@tarojs/runtime'

import type Taro from '@tarojs/taro/types'

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

eventCenter.once('__taroRouterLaunch', initLaunchOptions)

// 生命周期
export const getLaunchOptionsSync: typeof Taro.getLaunchOptionsSync = () => launchOptions
export const getEnterOptionsSync: typeof Taro.getEnterOptionsSync = () => launchOptions
