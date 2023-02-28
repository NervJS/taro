import Geolocation from '@react-native-community/geolocation'
import { createCallbackManager, errorHandler, successHandler } from '../utils'

const _cbManager = createCallbackManager()
let _watchID = -1

export function onLocationChange(callback: Taro.onLocationChange.Callback): void {
  _cbManager.add(callback)
}

export function offLocationChange(callback: Taro.onLocationChange.Callback): void {
  if (callback && typeof callback === 'function') {
    _cbManager.remove(callback)
  } else if (callback === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offLocationChange failed')
  }
}

/**
 * 开始监听位置信息
 * @param opts 
 * @returns 
 */
export function startLocationUpdate(opts: Taro.startLocationUpdate.Option): Promise<TaroGeneral.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'startLocationUpdate:ok' }
  try {
    if (_watchID > -1) {
      console.error('startLocationUpdate:fail')
      throw new Error('startLocationUpdate:fail')
    } else {
      _watchID = Geolocation.watchPosition(({ coords }) => {
        const { latitude, longitude, altitude, accuracy, speed } = coords
        _cbManager.trigger({
          accuracy,
          altitude,
          horizontalAccuracy: 0,
          verticalAccuracy: 0,
          latitude,
          longitude,
          speed,
        })
      }, err => {
        _cbManager.trigger({
          errMsg: 'Watch Position error',
          err
        })
      }, {
        timeout: 10,
        maximumAge: 0,
        enableHighAccuracy: true,
        distanceFilter: 0,
      })
      return successHandler(success, complete)(res)
    }
  } catch (error) {
    res.errMsg = 'startLocationUpdate:fail'
    return errorHandler(fail, complete)(res)
  }
}

/**
 * 停止监听位置信息
 * @param opts 
 * @returns 
 */
export function stopLocationUpdate(opts: Taro.stopLocationUpdate.Option): Promise<TaroGeneral.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'stopLocationUpdate:ok' }
  try {
    Geolocation.clearWatch(_watchID)
    _watchID = -1

    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'stopLocationUpdate:fail'

    return errorHandler(fail, complete)(res)
  }
}