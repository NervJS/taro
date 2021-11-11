// ✅ wx.stopLocationUpdate
// ✅ wx.startLocationUpdate
// ✅ wx.getLocation

// 集成在以上接口中
// ❌ wx.startLocationUpdateBackground
// ❌ wx.onLocationChangeError
// ❌ wx.onLocationChange
// ❌ wx.offLocationChangeError
// ❌ wx.offLocationChange

// 地图相关，无法实现
// ❌ wx.openLocation
// ❌ wx.choosePoi
// ❌ wx.chooseLocation
import { validateGeolocationOptions } from '../utils'
import { IAsyncParams } from '../utils/types'

const geolocation = require('@ohos.geolocation')

interface IGetWXGeolocationParams extends IAsyncParams {
  type?: string,
  altitude?: boolean,
  isHighAccuracy?: boolean,
  highAccuracyExpireTime?: number
}

interface IGetOHOSGeolocationParams extends IAsyncParams {
  coordType?: string,
  timeout?: number
}

export function getLocation (options: IGetWXGeolocationParams) {
  const { res, isPassed } = validateGeolocationOptions('getLocation', options)
  if (!isPassed) {
    return Promise.reject(res)
  }
  /**
   * TODO:
   * ohos 有 timeout，coordType，
   * wx 有 type，altitude，isHighAccuracy，highAccuracyExpireTime
   * 二者参数不一致
   */
  const { type, success, fail, complete } = options
  const params: IGetOHOSGeolocationParams = {}
  type && (params.coordType = type)

  geolocation.getCurrentLocation(params, (err, location) => {
    if (!err) {
      success && success(location)
    } else {
      fail && fail(location)
    }
    complete && complete(location)
  })
}

// export function startLocationUpdate (options: IAsyncParams) {
//   const { res, isPassed } = validateGeolocationOptions('startLocationUpdate', options)
//   if (!isPassed) {
//     return Promise.reject(res)
//   }
//   // TODO: ohos 有 coordType 参数，微信没有，需要兼容
//   const { success, fail, complete } = options
//   const params: IAsyncParams = {}
//   success && (params.success = success)
//   fail && (params.fail = fail)
//   complete && (params.complete = complete)
//   geolocation.subscribe(params)
// }

// export function stopLocationUpdate (options: IAsyncParams) {
//   const { res, isPassed } = validateGeolocationOptions('stopLocationUpdate', options)
//   if (!isPassed) {
//     return Promise.reject(res)
//   }
//   geolocation.unsubscribe()
// }
