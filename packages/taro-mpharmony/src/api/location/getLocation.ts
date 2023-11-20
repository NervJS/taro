import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { wgs84Togcj02 } from 'src/utils/coordinateConvert'

import { MethodHandler } from '../../utils/handler'

const HIGH_ACCURACY_TIMEOUT = 10000

/**
 * 获取当前的地理位置、速度
 * 
 * @canUse getLocation
 * @__object [altitude, highAccuracyExpireTime, isHighAccuracy, type]
 * @__success [accuracy, altitude, horizontalAccuracy, latitude, longitude, speed, verticalAccuracy]
 */
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
    altitude = 'false',
    highAccuracyExpireTime,
    isHighAccuracy = false,
    type = 'wgs84',
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<Taro.getLocation.SuccessCallbackResult>((resolve, reject) => {
    const loc: Partial<Taro.getLocation.SuccessCallbackResult> = {}
    let flag = true
    let timeoutId: NodeJS.Timeout
    // 只有开启了高精度定位才需要设置超时时间，默认超时时间10秒
    if (isHighAccuracy) {
      timeoutId = setTimeout(function () {
        if (!loc.latitude && !loc.longitude) {
          const result: TaroGeneral.CallbackResult = {
            errMsg: '定位超时！'
          }
          flag = false
          handle.fail(result, { resolve, reject })
        }
      }, highAccuracyExpireTime ?? HIGH_ACCURACY_TIMEOUT)
    }

    // @ts-ignore
    native.getLocation({
      success: (res: any) => {
        // 超时后即使后面回调触发了也不执行后面的逻辑
        if (!flag) {
          return
        }
        // 鸿蒙默认返回的是高精度定位的位置信息
        const lat = res.latitude
        const lng = res.longitude
        // 鸿蒙默认返回的是wgs84坐标
        if (type === 'gcj02') {
          const ret = wgs84Togcj02(lng, lat)
          loc.latitude = isHighAccuracy ? ret[1] : parseFloat(ret[1].toFixed(6))
          loc.longitude = isHighAccuracy ? ret[0] : parseFloat(ret[0].toFixed(6))
        } else if (type === 'wgs84') {
          loc.latitude = isHighAccuracy ? lat : parseFloat(lat.toFixed(6))
          loc.longitude = isHighAccuracy ? lng : parseFloat(lng.toFixed(6))
        } else {
          const result: TaroGeneral.CallbackResult = {
            errMsg: 'type参数有误，仅支持"wgs84"和"gcj02"坐标系！'
          }
          clearTimeout(timeoutId)
          return handle.fail(result, { resolve, reject })
        }
        const result: Taro.getLocation.SuccessCallbackResult = {
          /** 位置的精确度 */
          accuracy: res.accuracy,
          /** 高度，单位 m */
          altitude: JSON.parse(altitude) ? res.altitude : 0,
          /** 水平精度，单位 m */
          horizontalAccuracy: res.accuracy,
          /** 纬度，范围为 -90~90，负数表示南纬 */
          latitude: loc.latitude as number,
          /** 经度，范围为 -180~180，负数表示西经 */
          longitude: loc.longitude as number,
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
        if (!flag) {
          return
        }
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
