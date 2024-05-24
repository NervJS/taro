import Taro from '@tarojs/taro'

import native from '../NativeApi'
import { shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'

/**
 * 打开地图查看位置。(暂不支持scale入参)
 *
 * @canUse openLocation
 * @__object [latitude, longitude, address, name]
 */
export const openLocation: typeof Taro.openLocation = (options) => {
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `openLocation:fail ${isObject.msg}` }
    return Promise.reject(res)
  }
  const {
    latitude,
    longitude,
    address,
    name,
    success,
    fail,
    complete
  } = options
  const handle = new MethodHandler({ name: 'openLocation', success, fail, complete })
  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    native.openLocation({
      latitude,
      longitude,
      address,
      name,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      }
    })
  })
}