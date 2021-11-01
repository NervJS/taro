import { Linking, AppState, NativeEventSubscription } from 'react-native';
import * as Permissions from 'expo-permissions';
import { errorHandler, successHandler } from '../utils';

const scopeMap = {
  'scope.userLocation': Permissions.LOCATION,
  'scope.record': Permissions.AUDIO_RECORDING,
  'scope.writePhotosAlbum': Permissions.CAMERA_ROLL,
  'scope.camera': Permissions.CAMERA,
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
  const keyArr = Object.keys(scopeMap)
  const scopeArr = keyArr.map(key => scopeMap[key])
  let auths = {}
  const { permissions } = await Permissions.getAsync(...scopeArr)
  Object.keys(permissions).forEach(pkey => {
    keyArr.forEach((skey) => {
      if (scopeMap[skey] === pkey) {
        auths[skey] = permissions[pkey].status === 'granted'
      }
    })
  })
  return auths
}

const handleAppStateChange = async (nextAppState, resolve, reject, opts) => {
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

export async function authorize(opts: Taro.authorize.Option): Promise<Taro.General.CallbackResult> {
  const { scope, success, fail, complete } = opts
  const res: any = {}

    try {
      const { status } = await Permissions.askAsync(scopeMap[scope])
      if (status === 'granted') {
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
