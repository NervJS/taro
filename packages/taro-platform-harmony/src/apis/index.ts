import { Current, hooks } from '@tarojs/runtime'
import { PLATFORM_TYPE } from '@tarojs/shared'

import * as apis from './apis'
import { permanentlyNotSupport } from './utils'

const taro = Object.assign({}, apis)

const requirePlugin = /* @__PURE__ */ permanentlyNotSupport('requirePlugin')
export function initNativeApi (taro) {
  (Current as any).taro = taro
  taro.requirePlugin = requirePlugin
  taro.getApp = getApp
  taro.pxTransform = pxTransform
  taro.initPxTransform = initPxTransform
  taro.canIUseWebp = canIUseWebp
  taro.getAppInfo = getAppInfo

  if (hooks.isExist('initNativeApi')) {
    hooks.call('initNativeApi', taro)
  }
}

const defaultDesignWidth = 750
const defaultDesignRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
}
const defaultBaseFontSize = 20
const defaultUnitPrecision = 5
const defaultTargetUnit = 'vp'

export function getApp () {
  return Current.app
}

export function initPxTransform ({
  designWidth = defaultDesignWidth,
  deviceRatio = defaultDesignRatio,
  baseFontSize = defaultBaseFontSize,
  unitPrecision = defaultUnitPrecision,
  targetUnit = defaultTargetUnit
}) {
  const taro = (Current as any).taro

  if (taro) {
    taro.config ||= {}
    const config = taro.config
    config.designWidth = designWidth
    config.deviceRatio = deviceRatio
    config.baseFontSize = baseFontSize
    config.targetUnit = targetUnit
    config.unitPrecision = unitPrecision
  }
}

export function pxTransform (size: number): number {
  const config = (Current as any).taro?.config || {}
  const targetUnit = config.targetUnit || defaultTargetUnit

  let val = size
  switch (targetUnit) {
    case 'vp':
      val = px2vp(size)
      break
    default:
      // NOTE: 鸿蒙环境下 style 会自动完成设计稿转换，无需在方法内二次调整
  }
  return val + config.targetUnit
}

export function canIUseWebp () {
  return true
}

export function getAppInfo () {
  const config = (Current as any).taro?.config
  return {
    platform: process.env.TARO_PLATFORM || PLATFORM_TYPE.HARMONY,
    taroVersion: process.env.TARO_VERSION || 'unknown',
    designWidth: config?.designWidth,
  }
}

export * from './apis'
export default taro

// @ts-ignore
export const useDidHide = taro.useDidHide
// @ts-ignore
export const useDidShow = taro.useDidShow
// @ts-ignore
export const usePageScroll = taro.usePageScroll
