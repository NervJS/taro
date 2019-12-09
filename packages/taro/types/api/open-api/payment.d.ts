declare namespace Taro {
  namespace requestPayment {
    interface Option {
      /** 随机字符串，长度为32个字符以下 */
      nonceStr: string
      /** 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*** */
      package: string
      /** 签名，具体签名方案参见 [小程序支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3) */
      paySign: string
      /** 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间 */
      timeStamp: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 签名算法 */
      signType?: keyof signType
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    interface signType {
      /** MD5 */
      MD5
      /** HMAC-SHA256 */
      'HMAC-SHA256'
    }
  }

  /** 发起微信支付。了解更多信息，请查看[微信支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_3&index=1)
   * @supported weapp, h5
   * @example
   * ```tsx
   * Taro.requestPayment({
   *   timeStamp: '',
   *   nonceStr: '',
   *   package: '',
   *   signType: 'MD5',
   *   paySign: '',
   *   success: function (res) { },
   *   fail: function (res) { }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
   */
  function requestPayment(option: requestPayment.Option): Promise<General.CallbackResult>

  /** 支付各个安全场景验证人脸
   * @supported weapp
   * @example
   * ```tsx
   * Taro.faceVerifyForPay(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.faceVerifyForPay.html
   */
  function faceVerifyForPay(option: any): Promise<any>
}
