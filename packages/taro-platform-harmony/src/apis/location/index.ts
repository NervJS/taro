// @ts-nocheck
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

import geoLocationManager from '@ohos.geoLocationManager'

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../utils'
import { MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

// 位置
export const stopLocationUpdate = /* @__PURE__ */ temporarilyNotSupport('stopLocationUpdate')
export const startLocationUpdateBackground = /* @__PURE__ */ temporarilyNotSupport('startLocationUpdateBackground')
export const startLocationUpdate = /* @__PURE__ */ temporarilyNotSupport('startLocationUpdate')
export const openLocation = /* @__PURE__ */ temporarilyNotSupport('openLocation')

function formatLocation (location: Location) {
  const wxLocate = {
    latitude: location.latitude,
    longitude: location.longitude,
    altitude: location.altitude,
    accuracy: location.accuracy,
    speed: location.speed,
    verticalAccuracy: 0, // OHOS 不支持返回此参数，直接设置为默认值
    horizontalAccuracy: 0 // OHOS 不支持返回此参数，直接设置为默认值
  }
  return wxLocate
}
// TODO：增加参数校验
// const getLocationSchema = {
//   type: 'String',
//   altitude: 'Boolean',
//   ishighAccuracy: 'Boolean',
//   highAccuracyExpireTime: 'number'
// }

export const getLocation: typeof Taro.getLocation = function (options = {}) {
  return new Promise((resolve, reject) => {
    /**
     * ohos 有 priority, scenario, maxAccuracy, timeoutMs
     * wx 有 type, altitude, isHighAccuracy, highAccuracyExpireTime
     * 二者参数不一致
     */
    const { type, altitude, isHighAccuracy, highAccuracyExpireTime } = options
    try {
      return geoLocationManager.getCurrentLocation({
        type,
        altitude,
        isHighAccuracy,
        highAccuracyExpireTime
      }).then((location: Location) => {
        if (location.code !== 0) {
          callAsyncFail(reject, location, options)
        } else {
          const wxLocate = formatLocation(location.data)
          callAsyncSuccess(resolve, wxLocate, options)
        }
      }).catch(error => {
        callAsyncFail(reject, error, options)
      })
    } catch (error) {
      callAsyncFail(reject, error, options)
    }
  })
}

export const onLocationChange: typeof Taro.onLocationChange = function (callback) {
  const name = 'onLocationChange'
  const handle = new MethodHandler<Partial<Taro.onLocationChange.CallbackResult>>({ name, complete: callback })
  try {
    validateParams(name, [callback], ['Function'])
    geoLocationManager.on('locationChange', {}, (location: Location) => {
      if (location) {
        const wxLocate = formatLocation(location)
        callback(wxLocate)
      }
    })
  } catch (error) {
    handle.fail({
      errMsg: error
    })
  }
}

export const offLocationChange: typeof Taro.offLocationChange = function (callback) {
  const name = 'offLocationChange'
  const handle = new MethodHandler<Partial<Taro.onLocationChange.CallbackResult>>({ name, complete: callback })
  try {
    validateParams(name, [callback], ['Function'])
    geoLocationManager.off('locationChange', (location: Location) => {
      const status = {
        errCode: 200,
        errMsg: location ? 'offLocationChange is off' : 'offLocationChange err'
      }

      if (callback) {
        callback(status)
      }
    })
  } catch (error) {
    handle.fail({
      errMsg: error
    })
  }
}

export const onLocationChangeError = /* @__PURE__ */ temporarilyNotSupport('onLocationChangeError')
export const offLocationChangeError = /* @__PURE__ */ temporarilyNotSupport('offLocationChangeError')

export const choosePoi = /* @__PURE__ */ temporarilyNotSupport('choosePoi')
export const chooseLocation = /* @__PURE__ */ temporarilyNotSupport('chooseLocation')
export const getFuzzyLocation = /* @__PURE__ */ temporarilyNotSupport('getFuzzyLocation')
