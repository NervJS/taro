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
  namespace authorize {
    interface Option {
      /** 需要获取权限的 scope，详见 [scope 列表]((authorize#scope-列表)) */
      scope: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。更多用法详见 [用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)。
   * @supported weapp
   * @example
   * ```tsx
   * // 可以通过 Taro.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
   * Taro.getSetting({
   *   success: function (res) {
   *     if (!res.authSetting['scope.record']) {
   *       Taro.authorize({
   *         scope: 'scope.record',
   *         success: function () {
   *           // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
   *           Taro.startRecord()
   *         }
   *       })
   *     }
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
   */
  function authorize(option: authorize.Option): Promise<General.CallbackResult>
}
