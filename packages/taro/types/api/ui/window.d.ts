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
  namespace onWindowResize {
    /** 窗口尺寸变化事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      size: Size
    }

    interface Size {
      /** 变化后的窗口高度，单位 px */
      windowHeight: number
      /** 变化后的窗口宽度，单位 px */
      windowWidth: number
    }
  }
  /** 监听窗口尺寸变化事件
   * @supported weapp, h5
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html
   */
  function onWindowResize(
    /** 窗口尺寸变化事件的回调函数 */
    callback: onWindowResize.Callback,
  ): void

  namespace offWindowResize {
    /** 窗口尺寸变化事件的回调函数 */
    type Callback = (res: General.CallbackResult) => void
  }
  /** 取消监听窗口尺寸变化事件
   * @supported weapp, h5
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html
   */
  function offWindowResize(
    /** 窗口尺寸变化事件的回调函数 */
    callback: offWindowResize.Callback,
  ): void
}
