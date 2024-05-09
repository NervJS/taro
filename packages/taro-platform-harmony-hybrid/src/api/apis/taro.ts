import Taro from '@tarojs/api'
import DefaultTaroH5 from '@tarojs/taro-h5/dist/api/taro'

import {
  getApp,
  getCurrentInstance,
  getCurrentPages,
  navigateBack,
  navigateTo,
  nextTick,
  redirectTo,
  reLaunch,
  switchTab,
} from './index'

const requirePlugin = () => {
  return {
    world: '',
    hello: function () {

    }
  }
}

const NamedTaroHarmonyHybrid: typeof Taro = {
  ...DefaultTaroH5,
  getApp,
  getCurrentInstance,
  getCurrentPages,
  navigateBack,
  navigateTo,
  nextTick,
  redirectTo,
  reLaunch,
  switchTab,
  requirePlugin
}

export * from '@tarojs/taro-h5/dist/api/taro'

// 覆写H5的requirePlugin
export {
  requirePlugin
}

export default NamedTaroHarmonyHybrid
