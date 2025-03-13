import { permanentlyNotSupport } from '@tarojs/plugin-platform-harmony-ets/dist/apis/utils'
import { Current, hooks } from '@tarojs/runtime'
import { PLATFORM_TYPE } from '@tarojs/shared'

import * as apis from './apis'
import { initPxTransform, pxTransform } from './utils/unit'

const taro = Object.assign({}, apis)

const requirePlugin = /* @__PURE__ */ permanentlyNotSupport('requirePlugin')
export function initNativeApi (taro) {
  Current.taro = taro
  taro.requirePlugin = requirePlugin
  taro.getApp = getApp
  taro.pxTransform = pxTransform
  taro.initPxTransform = initPxTransform
  taro.canIUseWebp = canIUseWebp
  taro.getAppInfo = getAppInfo
  taro.getUIContext = getUIContext

  if (hooks.isExist('initNativeApi')) {
    hooks.call('initNativeApi', taro)
  }
}

export function getApp () {
  if (Current.page && Current.page.$isUseReact18) {
    return Current.entryAsync || {}
  }

  return Current.app || {}
}

export * from './utils/unit'

export function canIUseWebp () {
  return true
}

export function getAppInfo () {
  const config = Current.taro?.config
  return {
    platform: process.env.TARO_PLATFORM || PLATFORM_TYPE.HARMONY,
    taroVersion: process.env.TARO_VERSION || 'unknown',
    designWidth: config?.designWidth,
  }
}

export function getUIContext () {
  // @ts-ignore
  const uiContext = Current?.page?.getUIContext?.()

  if (!uiContext) return null

  return uiContext
}

initNativeApi(taro)

export * from './apis'
export default taro
