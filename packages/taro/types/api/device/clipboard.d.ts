/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
  namespace setClipboardData {
    interface Promised extends TaroGeneral.CallbackResult {
      /** 调用信息 */
      errMsg: string
      /** 剪贴板的内容 */
      data: string
    }
    interface Option {
      /** 剪贴板的内容 */
      data: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getClipboardData {
    interface Promised extends TaroGeneral.CallbackResult {
      /** 调用信息 */
      errMsg: string
      /** 剪贴板的内容 */
      data: string
    }
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackOption) => void
    }
    interface SuccessCallbackOption {
      /** 剪贴板的内容 */
      data: string
    }
  }

  interface TaroStatic {
    /** 设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
     * @supported weapp, h5, rn, tt
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
   setClipboardData(option: setClipboardData.Option): Promise<setClipboardData.Promised>

   /**
    * 获取系统剪贴板内容
    * @supported weapp, h5, rn, tt
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
   getClipboardData(res?: getClipboardData.Option): Promise<getClipboardData.Promised>
  }
}
