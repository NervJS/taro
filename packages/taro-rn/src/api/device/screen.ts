import * as Brightness from 'expo-brightness'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { errorHandler, shouleBeObject, successHandler } from '../utils'

/**
 * 设置屏幕亮度
 * @param opts
 * @param {number} opts.value - 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
 */
export async function setScreenBrightness (opts = {}) {
  let res = {errMsg: 'setScreenBrightness:ok'}

  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res = {errMsg: `setScreenBrightness${isObject.msg}`}
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {value, success, fail, complete}: any = opts
  try {
    await (Brightness as any).setBrightnessAsync(value)
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `setScreenBrightness:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}

/**
 * 获取屏幕亮度
 * @param opts
 */
export async function getScreenBrightness (opts = {}) {
  let res = {errMsg: 'getScreenBrightness:ok'} as any

  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res = {errMsg: `getScreenBrightness${isObject.msg}`}
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {success, fail, complete}: any = opts
  try {
    res.num = await (Brightness as any).getBrightnessAsync()
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `getScreenBrightness:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}

/**
 * keepScreenOn
 * @param {{}} opts
 * @param {boolean} opts.keepScreenOn - 是否保持屏幕常亮
 */
export async function setKeepScreenOn (opts = {}) {
  let res = {errMsg: 'setKeepScreenOn:ok'} as any
  const {keepScreenOn, success, fail, complete}: any = opts
  try {
    if (keepScreenOn) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `setKeepScreenOn:fail invalid ${e}`
    return errorHandler(fail, complete)(res)
  }
}

/**
 * @todo
 * 监听用户主动截屏事件。用户使用系统截屏按键截屏时触发
 */
export function onUserCaptureScreen (callback) {
  console.log('onUserCaptureScreen has not finished')
}
