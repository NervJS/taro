import Taro from '@tarojs/api'
import { history } from '@tarojs/router'
import { isFunction, PLATFORM_TYPE } from '@tarojs/shared'

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
} from '../api'

const {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  interceptorify,
  Current,
  options,
  eventCenter,
  Events,
  preload,
} = Taro as any

const taro: typeof Taro = {
  // @ts-ignore
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  interceptorify,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  preload,
  history,
  navigateBack,
  navigateTo,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab,
}

const requirePlugin = () => {
  return {
    world: '',
    hello: function () {

    }
  }
}
function getConfig (): Record<string, any> {
  if (this?.pxTransformConfig) return this.pxTransformConfig
  return ((taro as any).config ||= {})
}

const initPxTransform = function ({
  designWidth = 750,
  deviceRatio = {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  } as TaroGeneral.TDeviceRatio,
  baseFontSize = 20,
  unitPrecision = 5,
  targetUnit = 'rem',
}) {
  const config = getConfig.call(this)
  config.designWidth = designWidth
  config.deviceRatio = deviceRatio
  config.baseFontSize = baseFontSize
  config.targetUnit = targetUnit
  config.unitPrecision = unitPrecision
}

const pxTransform = function (size = 0) {
  const config = getConfig.call(this)
  const baseFontSize = config.baseFontSize || 20
  const designWidth = ((input = 0) =>
    isFunction(config.designWidth) ? config.designWidth(input) : config.designWidth)(size)
  if (!(designWidth in config.deviceRatio)) {
    throw new Error(`deviceRatio 配置中不存在 ${designWidth} 的设置！`)
  }
  const formatSize = ~~size
  let rootValue = 1 / config.deviceRatio[designWidth]
  switch (config?.targetUnit) {
    case 'vw':
      rootValue = designWidth / 100
      break
    case 'px':
      rootValue *= 2
      break
    default:
      // rem
      rootValue *= baseFontSize * 2
  }
  let val: number | string = formatSize / rootValue
  if (config.unitPrecision >= 0 && config.unitPrecision <= 100) {
    // Number(val): 0.50000 => 0.5
    val = Number(val.toFixed(config.unitPrecision))
  }
  return val + config?.targetUnit
}

/**
 * 判断能否使用WebP格式
 * 
 * @canUse canIUseWebp
 */
const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

const getAppInfo = function () {
  const config = getConfig.call(this)
  return {
    platform: process.env.TARO_PLATFORM || PLATFORM_TYPE.WEB,
    taroVersion: process.env.TARO_VERSION || 'unknown',
    designWidth: config.designWidth,
  }
}

taro.requirePlugin = requirePlugin
taro.getApp = getApp
taro.pxTransform = pxTransform
taro.initPxTransform = initPxTransform
taro.canIUseWebp = canIUseWebp

export default taro

/**
 * 跳转预加载 API
 * 
 * @canUse preload
 */

export {
  Behavior,
  canIUseWebp,
  Current,
  ENV_TYPE,
  eventCenter,
  Events,
  getAppInfo,
  getEnv,
  history,
  initPxTransform,
  interceptorify,
  interceptors,
  Link,
  options,
  preload,
  pxTransform,
  requirePlugin,
}
