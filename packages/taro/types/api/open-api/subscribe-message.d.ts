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
  namespace requestSubscribeMessage {
    interface Option {
      /** 需要订阅的消息模板的id的集合（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置 */
      tmplIds: any[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface FailCallbackResult extends General.CallbackResult {
      /** 接口调用失败错误码 */
      errCode: number
      /** 接口调用失败错误信息 */
      errMsg: string
    }

    /**
     * @example
     * 表示用户同意订阅 zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE 这条消息
     *
     * ```json
     * {
     *   "errMsg": "requestSubscribeMessage:ok",
     *   "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
     * }
     * ```
     */
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 动态的键，即模板id
       * @name [TEMPLATE_ID]
       * @type "accept" | "reject" | "ban"
       */
      [TEMPLATE_ID: string]: keyof template_reflex | string
      /** 接口调用成功时errMsg值为'requestSubscribeMessage:ok' */
      errMsg: string
    }

    /** 模版消息订阅类型 */
    interface template_reflex {
      /** 表示用户同意订阅该条id对应的模板消息 */
      accept
      /** 表示用户拒绝订阅该条id对应的模板消息 */
      reject
      /** 表示已被后台封禁 */
      ban
    }
  }

  /** 请求订阅消息
   * 
   * 注意：[2.8.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 版本开始，用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.requestSubscribeMessage({
   *   tmplIds: [''],
   *   success: function (res) { }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
   */
  function requestSubscribeMessage(
    option: requestSubscribeMessage.Option
  ): Promise<requestSubscribeMessage.SuccessCallbackResult | requestSubscribeMessage.FailCallbackResult>
}
