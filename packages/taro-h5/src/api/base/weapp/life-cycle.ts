import Taro from '@tarojs/api'

import taro, { eventCenter } from '../../taro'

function initLaunchOptions (options = {}) {
  (taro as any).launchOptions = options
}

eventCenter.once('__taroRouterLaunch', initLaunchOptions)

// 生命周期
export const getLaunchOptionsSync: typeof Taro.getLaunchOptionsSync = () => (taro as any).launchOptions
export const getEnterOptionsSync: typeof Taro.getEnterOptionsSync = () => (taro as any).launchOptions
