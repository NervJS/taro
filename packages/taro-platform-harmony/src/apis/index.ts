import { Current } from '@tarojs/runtime'

import * as apis from './apis'
import { noop } from './utils'

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
  Object.assign(taro, apis)
}

export function initPxTransform (_opts?: any) {
  // noop
}

export default apis
