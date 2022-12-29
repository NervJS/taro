import Taro from '@tarojs/api'

import { processOpenApi, shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

const getLocationByW3CApi: (options: Taro.getLocation.Option) => Promise<Taro.getLocation.SuccessCallbackResult> = (options: Taro.getLocation.Option): Promise<Taro.getLocation.SuccessCallbackResult> => {
  // 断言 options 必须是 Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getLocation:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  // 解构回调函数
  const { success, fail, complete } = options

  const handle = new MethodHandler({ name: 'getLocation', success, fail, complete })

  // const defaultMaximumAge = 5 * 1000

  const positionOptions: PositionOptions = {
    enableHighAccuracy: options.isHighAccuracy || (options.altitude != null), // 海拔定位需要高精度
    // maximumAge: defaultMaximumAge, // 允许取多久以内的缓存位置
    timeout: options.highAccuracyExpireTime // 高精度定位超时时间
  }

  // Web端API实现暂时仅支持GPS坐标系
  if (options.type?.toUpperCase() !== 'WGS84') {
    return handle.fail({
      errMsg: 'This coordinate system type is not temporarily supported'
    })
  }

  // 判断当前浏览器是否支持位置API
  const geolocationSupported = navigator.geolocation

  if (!geolocationSupported) {
    return handle.fail({
      errMsg: 'The current browser does not support this feature'
    })
  }

  // 开始获取位置
  return new Promise<Taro.getLocation.SuccessCallbackResult>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result: Taro.getLocation.SuccessCallbackResult = {
            /** 位置的精确度 */
            accuracy: position.coords.accuracy,
            /** 高度，单位 m */
            altitude: position.coords.altitude!,
            /** 水平精度，单位 m */
            horizontalAccuracy: position.coords.accuracy,
            /** 纬度，范围为 -90~90，负数表示南纬 */
            latitude: position.coords.latitude,
            /** 经度，范围为 -180~180，负数表示西经 */
            longitude: position.coords.longitude,
            /** 速度，单位 m/s */
            speed: position.coords.speed!,
            /** 垂直精度，单位 m（Android 无法获取，返回 0） */
            verticalAccuracy: position.coords.altitudeAccuracy || 0,
            /** 调用结果,自动补充 */
            errMsg: ''
          }
          handle.success(result, { resolve, reject })
        },
        (error) => {
          handle.fail({ errMsg: error.message }, { resolve, reject })
        },
        positionOptions
      )
    }
  )
}

export const getLocation = processOpenApi({
  name: 'getLocation',
  standardMethod: getLocationByW3CApi
})
