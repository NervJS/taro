import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../../utils'

const launchOptions: Taro.getLaunchOptionsSync.LaunchOptions = {
  path: '',
  query: {},
  scene: 0,
  shareTicket: '',
  referrerInfo: {},
}

function initLaunchOptions(options = {}) {
  Object.assign(launchOptions, options)
}

Taro.eventCenter.once('__taroRouterLaunch', initLaunchOptions)

// 生命周期
export const getLaunchOptionsSync: typeof Taro.getLaunchOptionsSync = () => launchOptions
export const getEnterOptionsSync: typeof Taro.getEnterOptionsSync = () => launchOptions

export const onApiCategoryChange = /* @__PURE__ */ temporarilyNotSupport('onApiCategoryChange')
export const offApiCategoryChange = /* @__PURE__ */ temporarilyNotSupport('offApiCategoryChange')
export const getApiCategory = /* @__PURE__ */ temporarilyNotSupport('getApiCategory')
