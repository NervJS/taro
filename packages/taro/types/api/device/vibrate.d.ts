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

/**
 *
 * Based on original code from: https://github.com/qiu8310/minapp/blob/master/packages/minapp-wx/typing/wx.d.ts
 * Lincenced under MIT license: https://github.com/qiu8310/minapp/issues/69
 *
 */
declare namespace Taro {
  namespace vibrateShort {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 使手机发生较短时间的振动（15 ms）。仅在 iPhone `7 / 7 Plus` 以上及 Android 机型生效
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.vibrateShort(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateShort.html
   */
  function vibrateShort(option?: vibrateShort.Option): Promise<General.CallbackResult>

  namespace vibrateLong {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 使手机发生较长时间的振动（400ms）
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.vibrateLong(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateLong.html
   */
  function vibrateLong(option?: vibrateLong.Option): Promise<General.CallbackResult>
}
