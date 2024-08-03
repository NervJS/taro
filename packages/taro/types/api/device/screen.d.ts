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

  namespace onScreenRecordingStateChanged {
    interface ScreenRecordingState {
      /** 开始录屏 */
      start
      /** 结束录屏 */
      stop
    }
    /** 用户录屏事件的监听函数 */
    type Callback = (
      /** 录屏状态 */
      state: keyof ScreenRecordingState,
    ) => void
  }

  namespace getScreenRecordingState {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (option: SuccessCallbackResult) => void
    }
    interface ScreenRecordingState {
      /** 开启 */
      on
      /** 关闭 */
      off
    }
    interface SuccessCallbackResult {
      /** 录屏状态 */
      state: keyof ScreenRecordingState
    }
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
     * @supported weapp, alipay
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setVisualEffectOnCapture.html
     */
    setVisualEffectOnCapture(option: setVisualEffectOnCapture.Option): Promise<TaroGeneral.CallbackResult>

    /** 设置屏幕亮度。
     * @supported weapp, swan, jd, qq, tt, rn
     * @example
     * ```tsx
     * Taro.setScreenBrightness(params).then(...)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html
     */
    setScreenBrightness(option: setScreenBrightness.Option): Promise<TaroGeneral.CallbackResult>

    /**
     * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效。
     * @supported weapp, alipay, swan, jd, qq, tt, rn, harmony_hybrid
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
     * @supported weapp, alipay, swan, jd, tt, harmony_hybrid
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

    /** 监听用户录屏事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.onScreenRecordingStateChanged.html
     * @example
     * ```tsx
     * // 监听用户录屏事件
     * const handler = function (res) {
     *     console.log(res.state)
     * }
     * Taro.onScreenRecordingStateChanged(handler)
     * ```
     */
    onScreenRecordingStateChanged(
      /** 用户录屏事件的监听函数 */
      callback: onScreenRecordingStateChanged.Callback
    ): void

    /** 用户主动截屏事件。取消事件监听。
     * @supported weapp, alipay, swan, jd, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.offUserCaptureScreen.html
     */
    offUserCaptureScreen(
      /** 用户主动截屏事件的回调函数 */
      callback: onUserCaptureScreen.Callback,
    ): void

    /** 取消用户录屏事件的监听函数
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.offScreenRecordingStateChanged.html 
     */
    offScreenRecordingStateChanged(
      /** 用户录屏事件的监听函数 */
      callback?: onScreenRecordingStateChanged.Callback
    ): void

    /** 查询用户是否在录屏
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenRecordingState.html
     * @example
     * ```tsx
     * Taro.getScreenRecordingState({
     *     success: function (res) {
     *         console.log(res.state)
     *     },
     * })
     * ```
     */
    getScreenRecordingState(
      option?: getScreenRecordingState.Option
    ): Promise<getScreenRecordingState.SuccessCallbackResult>

    /**
     * 获取屏幕亮度。
     *
     * **说明**
     * - 若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
     * @supported weapp, alipay, swan, jd, qq, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html
     */
    getScreenBrightness(
      option?: getScreenBrightness.Option
    ): Promise<getScreenBrightness.SuccessCallbackOption>
  }
}
