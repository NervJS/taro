declare namespace Taro {
  namespace setScreenBrightness {
    interface Option {
      /** 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮 */
      value: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 设置屏幕亮度。
   * @supported weapp, rn
   * @example
   * ```tsx
   * Taro.setScreenBrightness(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html
   */
  function setScreenBrightness(option: setScreenBrightness.Option): Promise<General.CallbackResult>

  namespace setKeepScreenOn {
    interface Promised extends General.CallbackResult {
      /** 调用结果 */
      errMsg: string
    }
    interface Option {
      /** 是否保持屏幕常亮 */
      keepScreenOn: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /**
   * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效。
   * @supported weapp
   * @example
   * ```tsx
   * // 保持屏幕常亮
   * Taro.setKeepScreenOn({
   *     keepScreenOn: true
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setKeepScreenOn.html
   */
  function setKeepScreenOn(option: setKeepScreenOn.Option): Promise<setKeepScreenOn.Promised>

  /**
   * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
   * @supported weapp
   * @example
   * ```tsx
   * Taro.onUserCaptureScreen(function (res) {
   *     console.log('用户截屏了')
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.onUserCaptureScreen.html
   */
  function onUserCaptureScreen(
    /** 用户主动截屏事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  namespace getScreenBrightness {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (option: SuccessCallbackOption) => void
    }

    interface SuccessCallbackOption {
      /** 屏幕亮度值，范围 0 ~ 1，0 最暗，1 最亮 */
      value: number
    }
  }
  /**
   * 获取屏幕亮度。
   * 
   * **说明**
   * - 若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html
   */
  function getScreenBrightness(
    option?: getScreenBrightness.Option
  ): Promise<getScreenBrightness.SuccessCallbackOption>

  /** 用户主动截屏事件。取消事件监听。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.offUserCaptureScreen.html
   */
  function offUserCaptureScreen(
    /** 用户主动截屏事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void
}
