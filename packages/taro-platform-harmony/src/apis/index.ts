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
  Object.defineProperty(taro, 'getApp', {
    configurable: true,
    enumerable: true,
    get () {
      return globalThis.getApp
    }
  })
}

export function initPxTransform (_opts?: any) {
  // noop
}

initNativeApi(taro)

export * from './apis'
export default taro
