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
import { General } from '@tarojs/taro'
import { validateGeolocationOptions } from '../utils'

const geolocation = require('@ohos.geolocation')

export interface GeoCallback {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: LocationSuccessWX | General.CallbackResult | boolean) => void
  /** 接口调用失败的回调函数 */
  fail?: (res: General.CallbackResult) => void
  /** 接口调用成功的回调函数 */
  success?: (res: LocationSuccessWX | boolean) => void
}

interface IGetWXGeolocationParams extends GeoCallback {
  type?: string,
  altitude?: boolean,
  isHighAccuracy?: boolean,
  highAccuracyExpireTime?: number
}

interface IGetOHOSGeolocationParams extends IGetWXGeolocationParams {
  priority?: number // 数值为固定几种
  scenario?: number // 数值为固定几种
  maxAccuracy?: number, // 表示精度信息，单位是米。
  timeoutMs?: number
}

function formatLocation (location: LocationSuccessOHOS) {
  const locationWX: LocationSuccessWX = {
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

export function getLocation (options: IGetWXGeolocationParams = {}) {
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
  const { type, altitude, isHighAccuracy, highAccuracyExpireTime, success, fail, complete } = options
  const params: IGetOHOSGeolocationParams = {}
  // 参数透传
  type !== undefined && (params.type = type)
  altitude !== undefined && (params.altitude = altitude)
  isHighAccuracy !== undefined && (params.isHighAccuracy = isHighAccuracy)
  highAccuracyExpireTime !== undefined && (params.highAccuracyExpireTime = highAccuracyExpireTime)

  if (success || fail || complete) {
    geolocation.getCurrentLocation(params, (err, location: LocationSuccessOHOS) => {
      if (!err) {
        const locationWX: LocationSuccessWX = formatLocation(location)
        success && success(locationWX)
        complete && complete(locationWX)
      } else {
        fail && fail(err)
        complete && complete(err)
      }
    })
  } else {
    return geolocation.getCurrentLocation(params).then((result: General.IAnyObject) => {
      const locationWX: LocationSuccessWX = {
        latitude: result.data.latitude,
        longitude: result.data.longitude,
        altitude: result.data.altitude,
        accuracy: result.data.accuracy,
        speed: result.data.speed,
        verticalAccuracy: 0,
        horizontalAccuracy: 0
      }
      return Promise.resolve(locationWX)
    }, (err: General.IAnyObject) => {
      return Promise.reject(err)
    })
  }
}

interface LocationRequest {
  priority?: number,
  scenario?: number, // 勘误：注意 Harmony OS 这个参数是必填
  timeInterval?: number,
  distanceInterval?: number,
  maxAccuracy?: number
}

interface LocationSuccessWX {
  latitude: number
  longitude: number
  altitude: number
  accuracy: number
  speed: number
  verticalAccuracy: number // 垂直精度，单位 m（Android 无法获取，返回 0）
  horizontalAccuracy: number
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
export function onLocationChange (options: GeoCallback = {}) {
  const { res, isPassed } = validateGeolocationOptions('onLocationChange', options)
  if (!isPassed) {
    return Promise.reject(res)
  }
  // TODO: ohos 有 coordType 参数，微信没有，需要兼容
  const { success, fail, complete } = options
  const requestInfo: LocationRequest = {}

  geolocation.on('locationChange', requestInfo, (location: LocationSuccessOHOS) => {
    if (location) {
      const locationWX: LocationSuccessWX = formatLocation(location)
      success && success(locationWX)
      complete && complete(locationWX)
    } else {
      const err = {
        errMsg: 'Get geolocation err'
      }
      fail && fail(err)
      complete && complete(err)
    }
  })
}

export function offLocationChange (options: GeoCallback = {}) {
  const { res, isPassed } = validateGeolocationOptions('offLocationChange', options)
  if (!isPassed) {
    return Promise.reject(res)
  }

  const { success, fail, complete } = options

  geolocation.off('locationChange', (location: LocationSuccessOHOS) => {
    if (location) {
      const locationWX: LocationSuccessWX = formatLocation(location)
      success && success(locationWX)
      complete && complete(locationWX)
    } else {
      const err = {
        errMsg: 'Get geolocation err'
      }
      fail && fail(err)
      complete && complete(err)
    }
  })
}

export function startLocationUpdate (options: GeoCallback = {}) {
  const { res, isPassed } = validateGeolocationOptions('startLocationUpdate', options)
  if (!isPassed) {
    return Promise.reject(res)
  }

  const { success, fail, complete } = options
  return geolocation.on('locationServiceState', (err: any, state: boolean) => {
    if (success || fail || complete) {
      if (!err) {
        success && success(state)
        complete && complete(state)
      } else {
        fail && fail(err)
        complete && complete(err)
      }
    } else {
      if (!err) {
        return Promise.resolve(state)
      } else {
        return Promise.reject(err)
      }
    }
  })
}

export function stopLocationUpdate (options: GeoCallback = {}) {
  const { res, isPassed } = validateGeolocationOptions('stopLocationUpdate', options)
  if (!isPassed) {
    return Promise.reject(res)
  }

  const { success, fail, complete } = options
  return geolocation.off('locationServiceState', (err: any, state: boolean) => {
    if (success || fail || complete) {
      if (!err) {
        success && success(state)
        complete && complete(state)
      } else {
        fail && fail(err)
        complete && complete(err)
      }
    } else {
      if (!err) {
        return Promise.resolve(state)
      } else {
        return Promise.reject(err)
      }
    }
  })
}
