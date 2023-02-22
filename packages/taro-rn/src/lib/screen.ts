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
