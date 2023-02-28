import * as Brightness from 'expo-brightness'
import { errorHandler, shouldBeObject, successHandler } from '../utils'

/**
 * 设置屏幕亮度
 * @param opts
 * @param {number} opts.value - 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
 */
export async function setScreenBrightness (opts: Taro.setScreenBrightness.Option): Promise<TaroGeneral.CallbackResult> {
  const { value, success, fail, complete } = opts
  let res = { errMsg: 'setScreenBrightness:ok' }

  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res = { errMsg: `setScreenBrightness${isObject.msg}` }
    return errorHandler(fail, complete)(res)
  }

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
export async function getScreenBrightness (opts: Taro.getScreenBrightness.Option = {}): Promise<TaroGeneral.CallbackResult> {
  const { success, fail, complete } = opts
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    const res = { errMsg: `getScreenBrightness${isObject.msg}` }
    return errorHandler(fail, complete)(res)
  }

  try {
    const value = await Brightness.getBrightnessAsync()
    const res = {
      errMsg: 'getScreenBrightness: ok',
      value
    }

    // @ts-ignore
    return successHandler(success, complete)(res)
  } catch (e) {
    const res = {
      errMsg: `getScreenBrightness:fail invalid ${e}`
    }
    return errorHandler(fail, complete)(res)
  }
}
