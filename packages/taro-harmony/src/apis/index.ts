import { noop } from './utils'
import * as apis from './apis'

export function initNativeApi (taro) {
  taro.initPxTransform = noop
  Object.assign(taro, apis)
}
