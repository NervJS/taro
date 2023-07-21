import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"

import { MethodHandler } from '../../utils/handler'

export const getLocation: typeof Taro.getLocation = (options) => {
  const name = 'getLocation'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<Taro.getLocation.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.getLocation({
      success: (res: any) => {
        const result: Taro.getLocation.SuccessCallbackResult = {
          /** 位置的精确度 */
          accuracy: res.accuracy,
          /** 高度，单位 m */
          altitude: res.altitude,
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
          errMsg: ''
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.message }, { resolve, reject })
      }
    })
  }) 
}