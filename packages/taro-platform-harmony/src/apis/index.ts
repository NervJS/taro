import { Current, hooks } from '@tarojs/runtime'

import * as apis from './apis'
import { noop } from './utils'

const taro = Object.assign({}, apis)
if (hooks.isExist('initNativeApi')) {
  hooks.call('initNativeApi', taro)
}

export function initNativeApi (taro) {
  (Current as any).taro = taro
  taro.initPxTransform = noop
  taro.getApp = () => Current.app
}

export function initPxTransform (_opts?: any) {
  // noop
}

initNativeApi(taro)

export * from './apis'
export default taro

// @ts-ignore
export const useDidHide = taro.useDidHide
// @ts-ignore
export const useDidShow = taro.useDidShow
