// HarmonyOS 文档: https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-geolocation-0000001199568865#section13752433138
// WX 文档: https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.onLocationChange.html
// ✅ wx.offLocationChange
// ✅ wx.getLocation
// ✅ wx.onLocationChange
// ✅ wx.stopLocationUpdate
// ✅ wx.startLocationUpdate

// 不支持实现
// ❌ wx.startLocationUpdateBackground
// ❌ wx.onLocationChangeError
// ❌ wx.offLocationChangeError
// ❌ wx.openLocation 地图相关
// ❌ wx.choosePoi 地图相关
// ❌ wx.chooseLocation 地图相关
import type Taro from '@tarojs/taro'
import { validateGeolocationOptions, getParameterError, callAsyncSuccess, callAsyncFail } from '../utils'
const geolocation = require('@ohos.geolocation')

type GetLocation = typeof Taro.getLocation
type OnLocationChange = typeof Taro.onLocationChange
type OffLocationChange = typeof Taro.offLocationChange
// type StartLocationUpdate = typeof Taro.startLocationUpdate
// type StopLocationUpdate = typeof Taro.stopLocationUpdate

interface IGetOHOSGeolocationParams {
  type?: string,
  altitude?: string,
  isHighAccuracy?: boolean,
  highAccuracyExpireTime?: number
  priority?: number // 数值为固定几种
  scenario?: number // 数值为固定几种
  maxAccuracy?: number, // 表示精度信息，单位是米。
  timeoutMs?: number
}

interface LocationRequest {
  priority?: number,
  scenario?: number, // 勘误：注意 Harmony OS 这个参数是必填
  timeInterval?: number,
  distanceInterval?: number,
  maxAccuracy?: number
}

interface LocationSuccessOHOS {
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

function formatLocation (location: LocationSuccessOHOS) {
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

export const getLocation: GetLocation = function (options) {
  const { res, isPassed } = validateGeolocationOptions('getLocation', options)
  if (!isPassed) {
    return Promise.reject(res)
  }
  /**
   * TODO:
   * ohos 有 priority, scenario, maxAccuracy, timeoutMs
   * wx 有 type, altitude, isHighAccuracy, highAccuracyExpireTime
   * 二者参数不一致
   */
  const { type, altitude, isHighAccuracy, highAccuracyExpireTime } = options
  const params: IGetOHOSGeolocationParams = {
    type,
    altitude,
    isHighAccuracy,
    highAccuracyExpireTime
  }
  return geolocation.getCurrentLocation(params, (err, location: LocationSuccessOHOS) => {
    if (err) {
      callAsyncFail(null, err, options)
      return Promise.reject(err)
    }

    const locationWX = formatLocation(location)
    callAsyncSuccess(null, locationWX, options)
    return Promise.resolve(locationWX)
  })
}

export const onLocationChange: OnLocationChange = function (callback) {
  if (typeof callback !== 'function') {
    const res = {
      errMsg: getParameterError({
        name: 'onLocationChange',
        correct: 'Function',
        wrong: callback
      })
    }
    return Promise.reject(res)
  }

  const requestInfo: LocationRequest = {}
  return geolocation.on('locationChange', requestInfo, (location: LocationSuccessOHOS) => {
    if (!location) {
      const err = { errMsg: 'get geolocation err' }
      return Promise.reject(err)
    }

    const locationWX = formatLocation(location)
    callback(locationWX)
    return Promise.resolve(locationWX)
  })
}

export const offLocationChange: OffLocationChange = function (callback) {
  if (typeof callback !== 'function') {
    const res = {
      errMsg: getParameterError({
        name: 'offLocationChange',
        correct: 'Function',
        wrong: callback
      })
    }
    return Promise.reject(res)
  }

  return geolocation.off('locationChange', (location: LocationSuccessOHOS) => {
    const status = {
      errMsg: location ? 'location change is off' : 'get geolocation err'
    }
    if (!location) {
      return Promise.reject(status)
    }

    callback(status)
    return Promise.resolve(status)
  })
}

// export const startLocationUpdate: StartLocationUpdate = function (options) {
//   const { res, isPassed } = validateGeolocationOptions('startLocationUpdate', options)
//   if (!isPassed) {
//     return Promise.reject(res)
//   }

//   const { success, fail, complete } = options
//   return geolocation.on('locationServiceState', (err: any, state: boolean) => {
//     if (success || fail || complete) {
//       if (!err) {
//         success && success(state)
//         complete && complete(state)
//       } else {
//         fail && fail(err)
//         complete && complete(err)
//       }
//     } else {
//       if (!err) {
//         return Promise.resolve(state)
//       } else {
//         return Promise.reject(err)
//       }
//     }
//   })
// }

// export const stopLocationUpdate: StopLocationUpdate = function (options) {
//   const { res, isPassed } = validateGeolocationOptions('stopLocationUpdate', options)
//   if (!isPassed) {
//     return Promise.reject(res)
//   }

//   const { success, fail, complete } = options
//   return geolocation.off('locationServiceState', (err: any, state: boolean) => {
//     if (success || fail || complete) {
//       if (!err) {
//         success && success(state)
//         complete && complete(state)
//       } else {
//         fail && fail(err)
//         complete && complete(err)
//       }
//     } else {
//       if (!err) {
//         return Promise.resolve(state)
//       } else {
//         return Promise.reject(err)
//       }
//     }
//   })
// }
