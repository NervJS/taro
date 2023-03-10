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
  namespace stopCompass {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace startCompass {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace onCompassChange {
    /** 罗盘数据变化事件的回调函数 */
    type Callback = (
      result: OnCompassChangeCallbackResult,
    ) => void
    interface OnCompassChangeCallbackResult {
      /** 精度
       *
       * 由于平台差异，accuracy 在 iOS/Android 的值不同。
       *
       * - iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。
       * - Android：accuracy 是一个 string 类型的枚举值。
       */
      accuracy: number | keyof accuracy | string
      /** 面对的方向度数 */
      direction: number
    }

    interface accuracy {
      /** 高精度 */
      high
      /** 中等精度 */
      medium
      /** 低精度 */
      low
      /** 不可信，传感器失去连接 */
      'no-contact'
      /** 不可信，原因未知 */
      unreliable
      /** 未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值 */
      'unknow ${value}'
    }
  }

  interface TaroStatic {
    /** 停止监听罗盘数据
     * @supported weapp, h5, tt
     * @example
     * ```tsx
     * Taro.stopCompass()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.stopCompass.html
     */
    stopCompass(option?: stopCompass.Option): Promise<TaroGeneral.CallbackResult>

    /** 开始监听罗盘数据
     * @supported weapp, h5, tt
     * @example
     * ```js
     * Taro.startCompass()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.startCompass.html
     */
    startCompass(option?: startCompass.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 Taro.stopCompass 停止监听。
     * @supported weapp, h5, tt
     * @example
     * ```tsx
     * Taro.onCompassChange(function (res) {
     *   console.log(res.direction)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html
     */
    onCompassChange(
      /** 罗盘数据变化事件的回调函数 */
      callback: onCompassChange.Callback,
    ): void

    /** 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.offCompassChange.html
     */
    offCompassChange(
      /** 罗盘数据变化事件的回调函数 */
      callback: (...args: any[]) => any,
    ): void
  }
}
