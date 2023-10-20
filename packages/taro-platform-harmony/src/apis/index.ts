import { Current, hooks } from '@tarojs/runtime'

import * as apis from './apis'
import { noop } from './utils'

const taro = Object.assign({}, apis)

export function initNativeApi (taro) {
  (Current as any).taro = taro
  taro.initPxTransform = noop
  taro.getApp = () => Current.app

  if (hooks.isExist('initNativeApi')) {
    hooks.call('initNativeApi', taro)
  }
}

export function initPxTransform (_opts?: any) {
  // noop
}

export * from './apis'
export default taro

// @ts-ignore
export const useDidHide = taro.useDidHide
// @ts-ignore
export const useDidShow = taro.useDidShow
// @ts-ignore
export const usePageScroll = taro.usePageScroll
