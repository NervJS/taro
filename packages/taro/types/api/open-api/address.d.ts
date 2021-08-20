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
  namespace chooseAddress {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult {
      /** 国标收货地址第二级地址 */
      cityName: string
      /** 国标收货地址第三级地址 */
      countyName: string
      /** 详细收货地址信息 */
      detailInfo: string
      /** 错误信息 */
      errMsg: string
      /** 收货地址国家码 */
      nationalCode: string
      /** 邮编 */
      postalCode: string
      /** 国标收货地址第一级地址 */
      provinceName: string
      /** 收货人手机号码 */
      telNumber: string
      /** 收货人姓名 */
      userName: string
    }
  }

  /** 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.chooseAddress({
   *   success: function (res) {
   *     console.log(res.userName)
   *     console.log(res.postalCode)
   *     console.log(res.provinceName)
   *     console.log(res.cityName)
   *     console.log(res.countyName)
   *     console.log(res.detailInfo)
   *     console.log(res.nationalCode)
   *     console.log(res.telNumber)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html
   */
  function chooseAddress(option?: chooseAddress.Option): Promise<chooseAddress.SuccessCallbackResult>
}
