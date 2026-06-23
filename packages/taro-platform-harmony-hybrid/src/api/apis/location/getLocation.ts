import Taro from '@tarojs/taro'

import { shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'
import nativeLocation from './NativeLocation'

/**
 * 获取当前的地理位置、速度
 *
 * @canUse getLocation
 * @__object [altitude, highAccuracyExpireTime, isHighAccuracy, type]
 * @__success [accuracy, altitude, horizontalAccuracy, latitude, longitude, speed, verticalAccuracy]
 */
export const getLocation: typeof Taro.getLocation = (options) => {
  const name = 'getLocation'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    return Promise.reject(res)
  }
  const {
    altitude = false,
    highAccuracyExpireTime,
    isHighAccuracy = false,
    type = 'wgs84',
    success,
    fail,
    complete,
  } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<Taro.getLocation.SuccessCallbackResult>((resolve, reject) => {
    nativeLocation.getLocation({
      isHighAccuracy: isHighAccuracy,
      highAccuracyExpireTime: highAccuracyExpireTime,
      type: type,
      success: (res: any) => {
        const result: Taro.getLocation.SuccessCallbackResult = {
          /** 位置的精确度 */
          accuracy: res.accuracy,
          /** 高度，单位 m */
          altitude: altitude ? res.altitude : 0,
          /** 水平精度，单位 m */
          horizontalAccuracy: res.accuracy,
          /** 纬度，范围为 -90~90，负数表示南纬 */
          latitude: res.latitude,
          /** 经度，范围为 -180~180，负数表示西经 */
          longitude: res.longitude,
          /** 速度，单位 m/s */
          speed: res.speed,
          /** 垂直精度，单位 m */
          verticalAccuracy: res.accuracy,
          /** 调用结果,自动补充 */
          errMsg: '',
        }
        handle.success(result, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
