import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { wgs84Togcj02 } from 'src/utils/coordinateConvert'

import { MethodHandler } from '../../utils/handler'

/**
 * 获取当前的模糊地理位置
 *  
 * @canUse getFuzzyLocation
 * @__object [type]
 * @__success [latitude, longitude]
 */
export const getFuzzyLocation: typeof Taro.getFuzzyLocation = (options) => {
  const name = 'getFuzzyLocation'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    type = 'wgs84',
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<Taro.getFuzzyLocation.SuccessCallbackResult>((resolve, reject) => {
    const fuzzyLocation: Partial<Taro.getFuzzyLocation.SuccessCallbackResult> = {}
    let flag = true

    // 默认10秒未获取则返回超时
    const timeoutId = setTimeout(function () {
      if (!fuzzyLocation.latitude && !fuzzyLocation.longitude) {
        const result: TaroGeneral.CallbackResult = {
          errMsg: '定位超时！'
        }
        flag = false
        handle.fail(result, { resolve, reject })
      }
    }, 10000)

    // @ts-ignore
    native.getLocation({
      success: (res: any) => {
        // 超时后即使后面回调触发了也不后面的逻辑
        if (!flag) {
          return
        }
        const lat = res.latitude
        const lng = res.longitude
        // 鸿蒙默认返回的是wgs84坐标
        if (type === 'gcj02') {
          const ret = wgs84Togcj02(lng, lat)
          fuzzyLocation.latitude = parseFloat(ret[1].toFixed(6))
          fuzzyLocation.longitude = parseFloat(ret[0].toFixed(6))
        } else if (type === 'wgs84') {
          fuzzyLocation.latitude = parseFloat(lat.toFixed(6))
          fuzzyLocation.longitude = parseFloat(lng.toFixed(6))
        } else {
          const result: TaroGeneral.CallbackResult = {
            errMsg: 'type参数有误，仅支持"wgs84"和"gcj02"坐标系！'
          }
          clearTimeout(timeoutId)
          return handle.fail(result, { resolve, reject })
        }
        handle.success(fuzzyLocation, { resolve, reject })
      },
      fail: (res: any) => {
        if (!flag) {
          return
        }
        const result: TaroGeneral.CallbackResult = {
          errMsg: `${name}:fail errCode: ${res.errCode}`
        }
        handle.fail(result, { resolve, reject })
      }
    })
  })
}