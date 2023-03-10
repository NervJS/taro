/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface FunctionalPageNavigatorProps extends StandardProps {
  /** 跳转到的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）；线上版本必须设置为 release
   * @default "release"
   * @supported weapp
   */
  version?: keyof FunctionalPageNavigatorProps.Version

  /** 要跳转到的功能页
   * @supported weapp
   */
  name?: keyof FunctionalPageNavigatorProps.Name

  /** 功能页参数，参数格式与具体功能页相关
   * @supported weapp
   */
  args?: object

  /** 功能页返回，且操作成功时触发， detail 格式与具体功能页相关
   * @supported weapp
   */
  onSuccess?: CommonEventFunction

  /** 功能页返回，且操作失败时触发， detail 格式与具体功能页相关
   * @supported weapp
   */
  onFail?: CommonEventFunction

  /** 因用户操作从功能页返回时触发
   * @supported weapp
   */
  onCancel?: CommonEventFunction
}
declare namespace FunctionalPageNavigatorProps {
  /** version 的合法值 */
  interface Version {
    /** 开发版 */
    develop

    /** 体验版 */
    trial

    /** 正式版 */
    release
  }

  /** name 的合法值 */
  interface Name {
    /** [用户信息功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/user-info.html) */
    loginAndGetUserInfo

    /** [支付功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/request-payment.html) */
    requestPayment

    /** [收货地址功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages/choose-address.html) */
    chooseAddress
  }
}

/** 仅在插件中有效，用于跳转到插件功能页
 * @classification navig
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/functional-page-navigator.html
 */
declare const FunctionalPageNavigator: ComponentType<FunctionalPageNavigatorProps>
export { FunctionalPageNavigator, FunctionalPageNavigatorProps }
