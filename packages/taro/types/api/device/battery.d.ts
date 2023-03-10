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
  namespace getBatteryInfoSync {
    interface Result {
      /** 是否正在充电中 */
      isCharging: boolean
      /** 设备电量，范围 1 - 100 */
      level: string
    }
  }

  namespace getBatteryInfo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 是否正在充电中 */
      isCharging: boolean
      /** 设备电量，范围 1 - 100 */
      level: number
      /** 调用结果 */
      errMsg: string
    }
  }

  interface TaroStatic {
    /** Taro.getBatteryInfo 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfoSync.html
     */
    getBatteryInfoSync(): getBatteryInfoSync.Result

    /** 获取设备电量。同步 API Taro.getBatteryInfoSync 在 iOS 上不可用。
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/battery/wx.getBatteryInfo.html
     */
    getBatteryInfo(option?: getBatteryInfo.Option): Promise<getBatteryInfo.SuccessCallbackResult>
  }
}
