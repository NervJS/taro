/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { Linking, AppState, NativeEventSubscription } from 'react-native';
import { getCameraPermissionsAsync, getMicrophonePermissionsAsync, requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } from 'expo-camera'
import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker'
import {
  getForegroundPermissionsAsync,
  // getBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  // requestBackgroundPermissionsAsync
} from 'expo-location'
import { errorHandler, successHandler } from '../utils';

const scopeMap = {
  'scope.userLocation': [getForegroundPermissionsAsync, requestForegroundPermissionsAsync],
  'scope.record': [getMicrophonePermissionsAsync, requestMicrophonePermissionsAsync],
  'scope.writePhotosAlbum': [getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync],
  'scope.camera': [getCameraPermissionsAsync, requestCameraPermissionsAsync],
  // 'scope.userLocationBackground': [getBackgroundPermissionsAsync, requestBackgroundPermissionsAsync],
  // 'scope.NOTIFICATIONS': Permissions.NOTIFICATIONS,
  // 'scope.USER_FACING_NOTIFICATIONS': Permissions.USER_FACING_NOTIFICATIONS,
  // 'scope.CONTACTS': Permissions.CONTACTS,
  // 'scope.CALENDAR': Permissions.CALENDAR,
  // 'scope.REMINDERS': Permissions.REMINDERS, // ios only
  // 'scope.SYSTEM_BRIGHTNESS': Permissions.SYSTEM_BRIGHTNESS
}

let stateListener // 缓存监听函数
let appStateSubscription: NativeEventSubscription | undefined

const getAuthSetting = async () => {
  let auths = {}

  await Promise.all(Object.keys(scopeMap).map(async key => {
    const { granted } = await scopeMap[key][0]()
    auths[key] = granted
  }))

  return auths
}

const handleAppStateChange = async (_nextAppState, resolve, reject, opts) => {
  const { success, fail, complete } = opts
  const res: any = {}

  if (AppState.currentState === 'active') {
    try {
      res.authSetting = await getAuthSetting()
      res.errMsg = 'openSetting:ok'
      success?.(res)
      complete?.(res)
  
      appStateSubscription?.remove()
      resolve(res)
    } catch (error) {
      res.errMsg = 'openSetting:fail'
      fail?.(res)
      complete?.(res)

      reject(error)
    }
  }
  // AppState.currentState = nextAppState;
};

export async function authorize(opts: Taro.authorize.Option): Promise<TaroGeneral.CallbackResult> {
  const { scope, success, fail, complete } = opts
  const res: any = {}

    try {
      const { granted } = await scopeMap[scope][1]()
      if (granted) {
        res.errMsg = 'authorize:ok'
        return successHandler(success, complete)(res)
      } else {
        res.errMsg = 'authorize:denied/undetermined'
        return errorHandler(fail, complete)(res)
      }
    } catch (error) {
      res.errMsg = 'authorize:fail'
      return errorHandler(fail, complete)(res)
    }
}

export async function getSetting(opts: Taro.getSetting.Option = {}): Promise<Taro.getSetting.SuccessCallbackResult> {
  const { success, fail, complete } = opts
  const res: any = {}

    try {
      res.authSetting = await getAuthSetting()
      res.errMsg = 'getSetting:ok'
      return successHandler(success, complete)(res)
    } catch (error) {
      res.errMsg = 'getSetting:fail'
      return errorHandler(fail, complete)(res)
    }
}

export function openSetting(opts: Taro.openSetting.Option = {}): Promise<Taro.openSetting.SuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    stateListener = (next) => handleAppStateChange(next, resolve, reject, opts)
    appStateSubscription = AppState.addEventListener('change', stateListener)
    Linking.openSettings()
  })
}
