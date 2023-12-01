import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听实时地理位置变化事件
 * 
 * @canUse offLocationChange
 */
export const offLocationChange: typeof Taro.offLocationChange = (callback) => {
  const name = 'offLocationChange'
  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  // @ts-ignore
  native.offLocationChange((res: any) => {
    const cbResult: Taro.onLocationChange.CallbackResult = {
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
    const result: TaroGeneral.CallbackResult = {
      /** 错误信息 */
      errMsg: JSON.stringify(cbResult),
    }
    callback(result)
  })
}
