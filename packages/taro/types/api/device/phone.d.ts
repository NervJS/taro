declare namespace Taro {
  namespace makePhoneCall {
    interface Option {
      /** 需要拨打的电话号码 */
      phoneNumber: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }
  /** 拨打电话
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.makePhoneCall({
   *   phoneNumber: '1340000' //仅为示例，并非真实的电话号码
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html
   */
  function makePhoneCall(option: makePhoneCall.Option): Promise<General.CallbackResult>
}
