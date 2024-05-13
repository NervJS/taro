import Taro from '@tarojs/taro'

import native from '../NativeApi'
import { shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'
/**
 * 获取当前的模糊地理位置
 *
 * @canUse getFuzzyLocation
 * @__object [type]
 * @__success [latitude, longitude]
 */
export const getFuzzyLocation: typeof Taro.getFuzzyLocation = (options) => {
  const name = 'getFuzzyLocation'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    return Promise.reject(res)
  }
  const {
    type = 'wgs84',
    success,
    fail,
    complete
  } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<Taro.getFuzzyLocation.SuccessCallbackResult>((resolve, reject) => {
    native.getLocation({
      type: type,
      isHighAccuracy: false,
      highAccuracyExpireTime: undefined,
      success: (res: any) => {
        const result: Taro.getFuzzyLocation.SuccessCallbackResult = {
          latitude: res.latitude,
          longitude: res.longitude,
          errMsg: ''
        }
        handle.success(result, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
