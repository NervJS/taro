import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 监听实时地理位置变化事件
 * 
 * @canUse onLocationChange
 * @__callback [accuracy, altitude, horizontalAccuracy, atitude, longitude, speed, verticalAccuracy]
 */
export const onLocationChange: typeof Taro.onLocationChange = (callback) => {
  const name = 'onLocationChange'
  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  // @ts-ignore
  native.onLocationChange((res: any) => {
    const result: Taro.onLocationChange.CallbackResult = {
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
    }
    callback(result)
  })
}
