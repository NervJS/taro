// HarmonyOS 文档: https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-geolocation-0000001199568865#section13752433138
// WX 文档: https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChange.html
// ✅ wx.offLocationChange
// ✅ wx.getLocation
// ✅ wx.onLocationChange

// 不支持实现
// ❌ wx.startLocationUpdateBackground
// ❌ wx.onLocationChangeError
// ❌ wx.offLocationChangeError
// ❌ wx.openLocation 地图相关
// ❌ wx.choosePoi 地图相关
// ❌ wx.chooseLocation 地图相关
// ❌ wx.stopLocationUpdate
// ❌ wx.startLocationUpdate
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

const geolocation = require('@ohos.geolocation')

type GetLocation = typeof Taro.getLocation
type OnLocationChange = typeof Taro.onLocationChange
type OffLocationChange = typeof Taro.offLocationChange

interface IGetOHOSGeolocationParams {
  type?: string
  altitude?: string
  isHighAccuracy?: boolean
  highAccuracyExpireTime?: number
  priority?: number // 数值为固定几种
  scenario?: number // 数值为固定几种
  maxAccuracy?: number // 表示精度信息，单位是米。
  timeoutMs?: number
}

interface LocationRequest {
  priority?: number
  scenario?: number // 勘误：注意 Harmony OS 这个参数是必填
  timeInterval?: number
  distanceInterval?: number
  maxAccuracy?: number
}

interface LocationSuccessDataOHOS {
  latitude: number
  longitude: number
  altitude: number
  accuracy: number
  speed: number
  timeStamp: number
  direction: number
  timeSinceBoot: number
  additions: Array<string>
  additionSize: number
}

interface LocationSuccessOHOS {
  code: number
  data: LocationSuccessDataOHOS
}

function formatLocation (location: LocationSuccessDataOHOS) {
  const locationWX = {
    latitude: location.latitude,
    longitude: location.longitude,
    altitude: location.altitude,
    accuracy: location.accuracy,
    speed: location.speed,
    verticalAccuracy: 0, // OHOS 不支持返回此参数，直接设置为默认值
    horizontalAccuracy: 0 // OHOS 不支持返回此参数，直接设置为默认值
  }
  return locationWX
}
// TODO：增加参数校验
// const getLocationSchema = {
//   type: 'String',
//   altitude: 'Boolean',
//   ishighAccuracy: 'Boolean',
//   highAccuracyExpireTime: 'number'
// }

export const getLocation: GetLocation = function (options = {}) {
  return new Promise((resolve, reject) => {
    /**
     * ohos 有 priority, scenario, maxAccuracy, timeoutMs
     * wx 有 type, altitude, isHighAccuracy, highAccuracyExpireTime
     * 二者参数不一致
     */
    const { type, altitude, isHighAccuracy, highAccuracyExpireTime } = options
    // try {
    //   validateParams('getLocation', options, getLocationSchema)
    // } catch (error) {
    //   const res = { errMsg: error.message }
    //   return callAsyncFail(reject, res, options)
    // }

    const params: IGetOHOSGeolocationParams = {
      type,
      altitude,
      isHighAccuracy,
      highAccuracyExpireTime
    }
    return geolocation.getCurrentLocation(params).then((location: LocationSuccessOHOS) => {
      if (location.code !== 0) {
        callAsyncFail(reject, location, options)
      } else {
        const locationWX = formatLocation(location.data)
        callAsyncSuccess(resolve, locationWX, options)
      }
    }).catch(error => {
      callAsyncFail(reject, error, options)
    })
  })
}

export const onLocationChange: OnLocationChange = function (callback) {
  validateParams('onLocationChange', [callback], ['Function'])
  const requestInfo: LocationRequest = {}
  geolocation.on('locationChange', requestInfo, (location: LocationSuccessDataOHOS) => {
    if (location) {
      const locationWX = formatLocation(location)
      callback(locationWX)
    }
  })
}

export const offLocationChange: OffLocationChange = function (callback) {
  validateParams('offLocationChange', [callback], ['Function'])
  geolocation.off('locationChange', (location: LocationSuccessOHOS) => {
    const status = {
      errMsg: location ? 'offLocationChange is off' : 'offLocationChange err'
    }
    callback(status)
  })
}
