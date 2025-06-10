import Taro from '@tarojs/taro'

import { shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'
import nativeLocation from './NativeLocation'

/**
 * 打开地图选择位置。
 *
 * @canUse chooseLocation
 * @__object [latitude, longitude]
 * @__success [address, latitude, longitude, name]
 */
export const chooseLocation: typeof Taro.chooseLocation = (options = {}) => {
  const name = 'chooseLocation'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `openLocation:fail ${isObject.msg}` }
    return Promise.reject(res)
  }
  const {
    latitude,
    longitude,
    success,
    fail,
    complete
  } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise<Taro.chooseLocation.SuccessCallbackResult>((resolve, reject) => {
    nativeLocation.chooseLocation({
      latitude,
      longitude,
      success: (res: any) => {
        const result: Taro.chooseLocation.SuccessCallbackResult = {
          address: res.address,
          latitude: res.location.latitude,
          longitude: res.location.longitude,
          name: res.name,
          errMsg: `${name}:ok`
        }
        handle.success(result, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      }
    })
  })
}
