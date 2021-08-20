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
  namespace getAccountInfoSync {
    /** 帐号信息 */
    interface AccountInfo {
      /** 小程序帐号信息 */
      miniProgram: MiniProgram
      /** 插件帐号信息（仅在插件中调用时包含这一项） */
      plugin: Plugin
    }
    /** 小程序帐号信息 */
    interface MiniProgram {
      /** 小程序 appId */
      appId: string
      /**
       * 小程序版本
       * @since 2.10.0
       */
      envVersion: 'develop' | 'trial' | 'release'
      /**
       * 线上小程序版本号
       * @since 2.10.2
       */
      version: string
    }
    /** 插件帐号信息（仅在插件中调用时包含这一项） */
    interface Plugin {
      /** 插件 appId */
      appId: string
      /** 插件版本号 */
      version: string
    }
  }

  /** 获取当前帐号信息
   * @supported weapp
   * @example
   * ```tsx
   * const accountInfo = Taro.getAccountInfoSync();
   *
   * console.log(accountInfo.miniProgram.appId) // 小程序 appId
   * console.log(accountInfo.plugin.appId) // 插件 appId
   * console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
   */
  function getAccountInfoSync(): getAccountInfoSync.AccountInfo
}
