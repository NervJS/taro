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
  namespace startDeviceMotionListening {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 监听设备方向的变化回调函数的执行频率
       * @default "normal"
       */
      interval?: keyof Interval
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface Interval {
      /** 适用于更新游戏的回调频率，在 20ms/次 左右 */
      game
      /** 适用于更新 UI 的回调频率，在 60ms/次 左右 */
      ui
      /** 普通的回调频率，在 200ms/次 左右 */
      normal
    }
  }

  namespace stopDeviceMotionListening {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace onDeviceMotionChange {
    /** 设备方向变化事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** 当 手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。 */
      alpha: number
      /** 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。 */
      beta: number
      /** 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。 */
      gamma: number
    }
  }

  interface TaroStatic {
    /** 开始监听设备方向的变化。
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.startDeviceMotionListening.html
     */
    startDeviceMotionListening(
      option: startDeviceMotionListening.Option,
    ): void

    /**
     * 停止监听设备方向的变化。
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.stopDeviceMotionListening.html
     */
    stopDeviceMotionListening(
      option?: stopDeviceMotionListening.Option,
    ): void

    /**
     * 监听设备方向变化事件。频率根据 Taro.startDeviceMotionListening() 的 interval 参数。可以使用 Taro.stopDeviceMotionListening() 停止监听。
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.onDeviceMotionChange.html
     */
    onDeviceMotionChange (callback: onDeviceMotionChange.Callback): void

    /** 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/motion/wx.offDeviceMotionChange.html
     */
    offDeviceMotionChange(
      /** 设备方向变化事件的回调函数 */
      callback?: (...args: any[]) => any,
    ): void
  }
}
