declare namespace Taro {
  namespace makePhoneCall {
    type Param = {
      /**
       * 需要拨打的电话号码
       */
      phoneNumber: string
    }
  }
  /**
   * @example
   * ```tsx
   * Taro.makePhoneCall({
   *   phoneNumber: '1340000' //仅为示例，并非真实的电话号码
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html
   */
  function makePhoneCall(res: makePhoneCall.Param): Promise<any>
}
