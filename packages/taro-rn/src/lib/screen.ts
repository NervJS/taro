import * as Brightness from 'expo-brightness'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import { errorHandler, shouleBeObject, successHandler } from '../utils'

/**
 * 设置屏幕亮度
 * @param opts
 * @param {number} opts.value - 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
 */
export async function setScreenBrightness (opts: Taro.setScreenBrightness.Option): Promise<Taro.General.CallbackResult> {
  let res = { errMsg: 'setScreenBrightness:ok' }

  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res = { errMsg: `setScreenBrightness${isObject.msg}` }
    return Promise.reject(res)
  }

  const { value, success, fail, complete } = opts
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
export async function getScreenBrightness (opts: Taro.getScreenBrightness.Option = {}): Promise<Taro.getScreenBrightness.SuccessCallbackOption> {
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    const res = { errMsg: `getScreenBrightness${isObject.msg}` }
    return Promise.reject(res)
  }

  const { success, fail, complete } = opts
  try {
    const value = await Brightness.getBrightnessAsync()
    const res = {
      errMsg: 'getScreenBrightness: ok',
      value
    }
    success?.(res)
    complete?.(res)
    return Promise.resolve(res)
  } catch (e) {
    const res = {
      errMsg: `getScreenBrightness:fail invalid ${e}`
    }
    return errorHandler(fail, complete)(res)
  }
}

/**
 * keepScreenOn
 * @param {{}} opts
 * @param {boolean} opts.keepScreenOn - 是否保持屏幕常亮
 */
export async function setKeepScreenOn (opts: Taro.setKeepScreenOn.Option): Promise<Taro.setKeepScreenOn.Promised> {
  const res = { errMsg: 'setKeepScreenOn:ok' } as any
  const { keepScreenOn, success, fail, complete } = opts
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
export function onUserCaptureScreen():void {
  console.log('onUserCaptureScreen has not finished')
}
