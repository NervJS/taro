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

import * as Brightness from 'expo-brightness'
import { errorHandler, shouleBeObject, successHandler } from '../utils'

/**
 * 设置屏幕亮度
 * @param opts
 * @param {number} opts.value - 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
 */
export async function setScreenBrightness (opts: Taro.setScreenBrightness.Option): Promise<Taro.General.CallbackResult> {
  const { value, success, fail, complete } = opts
  let res = { errMsg: 'setScreenBrightness:ok' }

  const isObject = shouleBeObject(opts)
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
export async function getScreenBrightness (opts: Taro.getScreenBrightness.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = opts
  const isObject = shouleBeObject(opts)
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
