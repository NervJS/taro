import { Linking, AppState } from 'react-native';
import * as Permissions from 'expo-permissions';

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
      success && success(res)
      complete && complete(res)
  
      AppState.removeEventListener('change', stateListener as any);
      resolve(res)
    } catch (error) {
      res.errMsg = 'openSetting:fail'
      fail && fail(res)
      complete && complete(res)
  
      reject(error)
    }
  }
  // AppState.currentState = nextAppState;
};

export function authorize(opts: Taro.authorize.Option): Promise<Taro.General.CallbackResult> {
  const { scope, success, fail, complete } = opts
  const res: any = {}

  return new Promise(async (resolve, reject) => {
    try {
      const { status } = await Permissions.askAsync(scopeMap[scope])
      if (status === 'granted') {
        res.errMsg = 'authorize:ok'
        success && success(res)
        complete && complete(res)

        resolve(res)
      } else {
        res.errMsg = 'authorize:denied/undetermined'
        fail && fail(res)
        complete && complete(res)

        resolve(res)
      }
    } catch (error) {
      res.errMsg = 'authorize:fail'
      fail && fail(res)
      complete && complete(res)

      reject(error)
    }
  })
}

export function getSetting(opts: Taro.getSetting.Option): Promise<Taro.getSetting.SuccessCallbackResult> {
  const { success, fail, complete } = opts
  const res: any = {}

  return new Promise(async (resolve, reject) => {
    try {
      res.authSetting = await getAuthSetting()
      res.errMsg = 'getSetting:ok'
      success && success(res)
      complete && complete(res)

      resolve(res)
    } catch (error) {
      res.errMsg = 'getSetting:fail'
      fail && fail(res)
      complete && complete(res)

      reject(error)
    }
  })
}

export function openSetting(opts: Taro.openSetting.Option): Promise<Taro.openSetting.SuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    stateListener = (next) => handleAppStateChange(next, resolve, reject, opts)
    AppState.addEventListener('change', stateListener)
    Linking.openSettings()
  })
}

