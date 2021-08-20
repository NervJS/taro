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
  namespace setClipboardData {
    interface Promised extends General.CallbackResult {
      /** 调用信息 */
      errMsg: string
      /** 剪贴板的内容 */
      data: string
    }
    interface Option {
      /** 剪贴板的内容 */
      data: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
   * @supported weapp, h5, rn
   * @h5 部分实现
   * @example
   * ```tsx
   * Taro.setClipboardData({
   *   data: 'data',
   *   success: function (res) {
   *     Taro.getClipboardData({
   *       success: function (res) {
   *         console.log(res.data) // data
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html
   */
 function setClipboardData(option: setClipboardData.Option): Promise<setClipboardData.Promised>

  namespace getClipboardData {
    interface Promised extends General.CallbackResult {
      /** 调用信息 */
      errMsg: string
      /** 剪贴板的内容 */
      data: string
    }
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackOption) => void
    }
    interface SuccessCallbackOption {
      /** 剪贴板的内容 */
      data: string
    }
  }
  /**
   * 获取系统剪贴板内容
   * @supported weapp, h5, rn
   * @h5 部分实现
   * @example
   * ```tsx
   * Taro.getClipboardData({
   *   success: function (res){
   *     console.log(res.data)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.getClipboardData.html
   */
  function getClipboardData(res?: getClipboardData.Option): Promise<getClipboardData.Promised>
}
