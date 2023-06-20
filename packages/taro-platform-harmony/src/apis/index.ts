import * as apis from './apis'
import { current, noop } from './utils'

export function initNativeApi (taro) {
  current.taro = taro
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
