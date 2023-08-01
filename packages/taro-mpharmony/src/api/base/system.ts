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
  info.safeArea = info.safeArea || {
    bottom: 0,
    /** 安全区域的高度，单位逻辑像素 */
    height: 0,
    /** 安全区域左上角横坐标 */
    left: 0,
    /** 安全区域右下角横坐标 */
    right: 0,
    /** 安全区域左上角纵坐标 */
    top: 0,
    /** 安全区域的宽度，单位逻辑像素 */
    width: 0
  }
  return info
}

/** 获取设备设置 */
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getSystemSetting()))

  return info
}

/** 获取设备信息 */
export const getDeviceInfo: typeof Taro.getDeviceInfo = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getDeviceInfo()))

  return {
    ...info,
    platform: 'harmony'
  }
}

/** 获取微信APP基础信息 */
// @ts-ignore
export const getAppBaseInfo: typeof Taro.getAppBaseInfo = async () => {
  // @ts-ignore
  const info = await native.getAppBaseInfo()
  info.version = info.appVersion
  info.language = info.appLanguage
  delete info.appVersion
  delete info.appLanguage
  return info
}

/** 获取微信APP授权设置 */
// @ts-ignore
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = async () => {
  // @ts-ignore
  const info = await native.getAppAuthorizeSetting()
  return {
    ...info,
    locationReducedAccuracy: info.locationAccuracy
  }
}

/** 获取设备设置 */
export const getSystemInfoSync: typeof Taro.getSystemInfoSync = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getSystemInfoSync()))
  
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
