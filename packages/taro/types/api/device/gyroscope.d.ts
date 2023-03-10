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
  namespace stopGyroscope {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }


  namespace startGyroscope {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 监听陀螺仪数据回调函数的执行频率 */
      interval?: keyof Interval
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }

    /** 监听陀螺仪数据回调函数的执行频率 */
    interface Interval {
      /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
      game
      /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
      ui
      /** 普通的回调频率，在 200ms/次 左右 */
      normal
    }
  }

  namespace onGyroscopeChange {
    /** 陀螺仪数据变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** x 轴的角速度 */
      x: number
      /** y 轴的角速度 */
      y: number
      /** z 轴的角速度 */
      z: number
    }
  }

  interface TaroStatic {
    /** 停止监听陀螺仪数据。
     * @supported weapp, rn, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.stopGyroscope.html
     */
    stopGyroscope(option?: stopGyroscope.Option): Promise<TaroGeneral.CallbackResult>

    /** 开始监听陀螺仪数据。
     * @supported weapp, rn, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.startGyroscope.html
     */
    startGyroscope(option: startGyroscope.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。
     * @supported weapp, rn, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.onGyroscopeChange.html
     */
    onGyroscopeChange(
      /** 陀螺仪数据变化事件的回调函数 */
      callback: onGyroscopeChange.Callback,
    ): void

    /** 取消监听陀螺仪数据变化事件。
     * @supported weapp, rn, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/gyroscope/wx.offGyroscopeChange.html
     */
    offGyroscopeChange(
      /** 陀螺仪数据变化事件的回调函数 */
      callback?: (...args: any[]) => any,
    ): void
  }
}
