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

import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface FunctionalPageNavigatorProps extends StandardProps {
  /** 跳转到的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版）；线上版本必须设置为 release
   * @default "release"
   * @supported weapp
   */
  version?: keyof FunctionalPageNavigatorProps.version

  /** 要跳转到的功能页
   * @supported weapp
   */
  name?: keyof FunctionalPageNavigatorProps.name

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
  interface version {
    /** 开发版 */
    develop
    /** 体验版 */
    trial
    /** 正式版 */
    release
  }
  /** name 的合法值 */
  interface name {
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
