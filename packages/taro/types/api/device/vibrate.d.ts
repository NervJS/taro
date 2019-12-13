declare namespace Taro {
  namespace vibrateShort {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 使手机发生较短时间的振动（15 ms）。仅在 iPhone `7 / 7 Plus` 以上及 Android 机型生效
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.vibrateShort(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateShort.html
   */
  function vibrateShort(option?: vibrateShort.Option): Promise<General.CallbackResult>

  namespace vibrateLong {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 使手机发生较长时间的振动（400ms）
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.vibrateLong(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateLong.html
   */
  function vibrateLong(option?: vibrateLong.Option): Promise<General.CallbackResult>
}
