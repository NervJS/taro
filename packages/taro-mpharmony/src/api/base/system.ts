import Taro from '@tarojs/api'

import { shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/** 跳转系统蓝牙设置页 */
export const openSystemBluetoothSetting = /* @__PURE__ */ temporarilyNotSupport('openSystemBluetoothSetting')

/** 跳转系统微信授权管理页 */
export const openAppAuthorizeSetting: typeof Taro.openAppAuthorizeSetting = (options) => {
  const name = 'openAppAuthorizeSetting'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  // @ts-ignore
  const ret = native.openAppAuthorizeSetting({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}

/** 获取窗口信息 */
// @ts-ignore
export const getWindowInfo: typeof Taro.getWindowInfo = async () => {

  // @ts-ignore
  const info = await native.getWindowInfo()

  return info
}

/** 获取设备设置 */
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  const isLandscape = window.screen.width >= window.screen.height
  const info: ReturnType<typeof Taro.getSystemSetting> = {
    /** 蓝牙的系统开关 */
    bluetoothEnabled: false,
    /** 地理位置的系统开关 */
    locationEnabled: false,
    /** Wi-Fi 的系统开关 */
    wifiEnabled: false,
    /** 设备方向 */
    deviceOrientation: isLandscape ? 'landscape' : 'portrait'
  }

  return info
}

/** 获取设备信息 */
export const getDeviceInfo: typeof Taro.getDeviceInfo = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getDeviceInfo()))

  return info
}

/** 获取微信APP基础信息 */
// @ts-ignore
export const getAppBaseInfo: typeof Taro.getAppBaseInfo = async () => {
  // @ts-ignore
  const info = await native.getAppBaseInfo()

  return info
}

/** 获取微信APP授权设置 */
// @ts-ignore
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = async () => {
  // @ts-ignore
  const info = await native.getAppAuthorizeSetting()

  return info
}

/** 获取设备设置 */
export const getSystemInfoSync: typeof Taro.getSystemInfoSync = () => {
  const windowInfo = getWindowInfo()
  const systemSetting = getSystemSetting()
  const deviceInfo: Taro.getDeviceInfo.Result = getDeviceInfo()
  const appBaseInfo = getAppBaseInfo()
  const appAuthorizeSetting = getAppAuthorizeSetting()
  delete deviceInfo.abi

  const info: ReturnType<typeof Taro.getSystemInfoSync> = {
    ...windowInfo,
    ...systemSetting,
    ...deviceInfo,
    ...appBaseInfo,
    /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
    fontSizeSetting: NaN,
    /** 允许微信使用相册的开关（仅 iOS 有效） */
    albumAuthorized: appAuthorizeSetting.albumAuthorized === 'authorized',
    /** 允许微信使用摄像头的开关 */
    cameraAuthorized: appAuthorizeSetting.cameraAuthorized === 'authorized',
    /** 允许微信使用定位的开关 */
    locationAuthorized: appAuthorizeSetting.locationAuthorized === 'authorized',
    /** 允许微信使用麦克风的开关 */
    microphoneAuthorized: appAuthorizeSetting.microphoneAuthorized === 'authorized',
    /** 允许微信通知的开关 */
    notificationAuthorized: appAuthorizeSetting.notificationAuthorized === 'authorized',
    /** 允许微信通知带有提醒的开关（仅 iOS 有效） */
    notificationAlertAuthorized: appAuthorizeSetting.notificationAlertAuthorized === 'authorized',
    /** 允许微信通知带有标记的开关（仅 iOS 有效） */
    notificationBadgeAuthorized: appAuthorizeSetting.notificationBadgeAuthorized === 'authorized',
    /** 允许微信通知带有声音的开关（仅 iOS 有效） */
    notificationSoundAuthorized: appAuthorizeSetting.notificationSoundAuthorized === 'authorized',
    /** 允许微信使用日历的开关 */
    phoneCalendarAuthorized: appAuthorizeSetting.phoneCalendarAuthorized === 'authorized',
    /** `true` 表示模糊定位，`false` 表示精确定位，仅 iOS 支持 */
    locationReducedAccuracy: appAuthorizeSetting.locationReducedAccuracy,
    /** 小程序当前运行环境 */
    environment: ''
  }

  return info
}

/** 获取系统信息 */
export const getSystemInfoAsync: typeof Taro.getSystemInfoAsync = async (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getSystemInfoAsync', success, fail, complete })

  try {
    const info = await getSystemInfoSync()
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }
}

/** 获取系统信息 */
export const getSystemInfo: typeof Taro.getSystemInfo = async (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getSystemInfo', success, fail, complete })

  try {
    const info = await getSystemInfoSync()
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }
}
