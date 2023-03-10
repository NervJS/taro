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
  namespace setVisualEffectOnCapture {
    interface Option {
      /** 截屏/录屏时的表现，仅支持 none / hidden，传入 hidden 则表示在截屏/录屏时隐藏屏幕
       * @default "none"
       */
      visualEffect?: 'none' | 'hidden'
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setScreenBrightness {
    interface Option {
      /** 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮 */
      value: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setKeepScreenOn {
    interface Promised extends TaroGeneral.CallbackResult {
      /** 调用结果 */
      errMsg: string
    }
    interface Option {
      /** 是否保持屏幕常亮 */
      keepScreenOn: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace onUserCaptureScreen {
    /** 用户主动截屏事件的回调函数 */
    type Callback = (
        result: TaroGeneral.CallbackResult,
    ) => void
  }

  namespace getScreenBrightness {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (option: SuccessCallbackOption) => void
    }

    interface SuccessCallbackOption {
      /** 屏幕亮度值，范围 0 ~ 1，0 最暗，1 最亮 */
      value: number
    }
  }

  interface TaroStatic {
    /** 设置截屏/录屏时屏幕表现，仅支持在 Android 端调用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setVisualEffectOnCapture.html
     */
    setVisualEffectOnCapture(option: setVisualEffectOnCapture.Option): Promise<TaroGeneral.CallbackResult>

    /** 设置屏幕亮度。
     * @supported weapp, rn, tt
     * @example
     * ```tsx
     * Taro.setScreenBrightness(params).then(...)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html
     */
    setScreenBrightness(option: setScreenBrightness.Option): Promise<TaroGeneral.CallbackResult>

    /**
     * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效。
     * @supported weapp, rn, tt
     * @example
     * ```tsx
     * // 保持屏幕常亮
     * Taro.setKeepScreenOn({
     *     keepScreenOn: true
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setKeepScreenOn.html
     */
    setKeepScreenOn(option: setKeepScreenOn.Option): Promise<setKeepScreenOn.Promised>

    /**
     * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.onUserCaptureScreen(function (res) {
     *     console.log('用户截屏了')
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.onUserCaptureScreen.html
     */
    onUserCaptureScreen(
      /** 用户主动截屏事件的回调函数 */
      callback: onUserCaptureScreen.Callback,
    ): void

    /** 用户主动截屏事件。取消事件监听。
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.offUserCaptureScreen.html
     */
    offUserCaptureScreen(
      /** 用户主动截屏事件的回调函数 */
      callback: onUserCaptureScreen.Callback,
    ): void

    /**
     * 获取屏幕亮度。
     *
     * **说明**
     * - 若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
     * @supported weapp, rn, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html
     */
    getScreenBrightness(
      option?: getScreenBrightness.Option
    ): Promise<getScreenBrightness.SuccessCallbackOption>
  }
}
