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

import Taro from '../../index'

declare module '../../index' {
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

  interface TaroStatic {
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
    getAccountInfoSync(): getAccountInfoSync.AccountInfo
  }
}
