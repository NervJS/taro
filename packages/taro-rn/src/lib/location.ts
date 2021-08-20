/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
export function startLocationUpdate(opts: Taro.startLocationUpdate.Option): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'startLocationUpdate:ok' }
  try {
    if (_watchID > -1) {
      console.error('startLocationUpdate:fail')
      throw new Error('startLocationUpdate:fail')
    } else {
      _watchID = Geolocation.watchPosition(({ coords }) => {
        const { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed } = coords
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
export function stopLocationUpdate(opts: Taro.stopLocationUpdate.Option): Promise<Taro.General.CallbackResult> {
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