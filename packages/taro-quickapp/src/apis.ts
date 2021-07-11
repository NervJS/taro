import * as supportApi from './api'

export function initNativeApi (taro) {
  Object.assign(taro, supportApi)
}
