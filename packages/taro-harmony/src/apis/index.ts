import { noop, current } from './utils'
import * as apis from './apis'

export function initNativeApi (taro) {
  current.taro = taro
  taro.initPxTransform = noop
  Object.assign(taro, apis)
}
