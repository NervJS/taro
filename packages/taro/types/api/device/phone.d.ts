import Taro from '../../index'

declare module '../../index' {
  namespace makePhoneCall {
    interface Option {
      /** 需要拨打的电话号码 */
      phoneNumber: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 拨打电话
     * @supported weapp, swan, jd, qq, tt, h5, rn, harmony_hybrid
     * @example
     * ```tsx
     * Taro.makePhoneCall({
     *   phoneNumber: '1340000' //仅为示例，并非真实的电话号码
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html
     */
    makePhoneCall(option: makePhoneCall.Option): Promise<TaroGeneral.CallbackResult>
  }
}
