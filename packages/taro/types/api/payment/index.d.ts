import Taro from '../../index'

declare module '../../index' {
  namespace requestPayment {
    interface Option {
      /** 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间 */
      timeStamp: string
      /** 随机字符串，长度为32个字符以下 */
      nonceStr: string
      /** 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*** */
      package: string
      /** 签名算法 */
      signType?: keyof SignType
      /** 签名，具体签名方案参见 [小程序支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3) */
      paySign: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }

    interface SignType {
      /** 仅在微信支付 v2 版本接口适用 */
      MD5
      /** 仅在微信支付 v2 版本接口适用 */
      'HMAC-SHA256'
      /** 仅在微信支付 v3 版本接口适用 */
      RSA
    }
  }

  namespace requestCommonPayment {
    interface Option {
      /** 支付的类型 */
      mode: Mode
      /** 具体支付参数。该参数需要序列化为字符串传递 */
      signData: string
      /** 支付签名，详见微信官方文档《签名详解》 */
      paySig: string
      /** 用户态签名，详见微信官方文档《签名详解》 */
      signature: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }

    /**
     * 支付类型：B2b 支付、间接支付、合单支付或多渠道 B2b 支付
     */
    type Mode = 'retail_pay_goods' | 'retail_pay_indirect_goods' | 'retail_pay_combined_goods' | 'retail_pay_goods_new'

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {}

    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 错误码 */
      errno: number
    }
  }

  namespace requestOrderPayment {
    interface Option {
      /** 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间 */
      timeStamp: string
      /** 随机字符串，长度为32个字符以下 */
      nonceStr: string
      /** 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*** */
      package: string
      /** 订单信息，仅在需要校验的场景下需要传递，具体见[接口说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ministore/minishopopencomponent2/API/order/requestOrderPayment) */
      orderInfo?
      /** 外部 APP 用户 ID */
      extUserUin?: string
      /** 签名算法 */
      signType?: keyof SignType
      /** 签名，具体签名方案参见 [小程序支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3) */
      paySign: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }

    interface SignType {
      /** 仅在微信支付 v2 版本接口适用 */
      MD5
      /** 仅在微信支付 v2 版本接口适用 */
      'HMAC-SHA256'
      /** 仅在微信支付 v3 版本接口适用 */
      RSA
    }
  }

  interface TaroStatic {
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
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestPayment.html
     */
    requestPayment(option: requestPayment.Option): Promise<TaroGeneral.CallbackResult>

    /** 发起通用支付。目前仅支持 B2b 支付类型
     * @supported weapp
     * @since 2.19.2
     * @example
     * ```tsx
     * Taro.requestCommonPayment({
     *   mode: 'retail_pay_goods',
     *   signData: JSON.stringify({
     *     mchid: '1234567890',
     *     out_trade_no: 'test1244',
     *     description: '测试订单',
     *     amount: {
     *       order_amount: 1,
     *       currency: 'CNY'
     *     },
     *     env: 0
     *   }),
     *   paySig: '',
     *   signature: '',
     *   success (res) { },
     *   fail (res) { }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestCommonPayment.html
     */
    requestCommonPayment(option: requestCommonPayment.Option): void

    /** 创建自定义版交易组件订单，并发起支付。 仅接入了[自定义版交易组件](https://developers.weixin.qq.com/miniprogram/dev/framework/ministore/minishopopencomponent2/Introduction2)的小程序需要使用，普通小程序可直接使用 `Taro.requestPayment`。
     * @supported weapp
     * @example
     * 除 orderInfo 以外，其余字段与 [Taro.requestPayment](./requestPayment) 一致
     *
     * ```tsx
     * Taro.requestOrderPayment({
     *   orderInfo: {},
     *   timeStamp: '',
     *   nonceStr: '',
     *   package: '',
     *   signType: 'MD5',
     *   paySign: '',
     *   success (res) { },
     *   fail (res) { }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestOrderPayment.html
     */
    requestOrderPayment(option: requestOrderPayment.Option): Promise<TaroGeneral.CallbackResult>

    /** 支付各个安全场景验证人脸
     * @supported weapp
     * @deprecated
     * @example
     * ```tsx
     * Taro.faceVerifyForPay(params).then(...)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.faceVerifyForPay.html
     */
    faceVerifyForPay(option: any): Promise<any>
  }
}
