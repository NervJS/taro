import Taro from '../../index'

declare module '../../index' {
  namespace getOpenUserInfo  {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?:(res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult {
      /** 返回一个 Object 类型的对象 res。使用 JSON.parse(res.response).response 解析 */
      response: string
    }
  }
  namespace tradePay  {
    interface Option {
      /** 接入小程序支付时传入此参数。此参数为支付宝交易号，注意参数有大小写区分（调用 小程序支付 时必填） */
      tradeNO?: string
      /** 完整的支付参数拼接成的字符串，从服务端获取（调用 支付宝预授权 时必填） */
      orderStr?: string
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?:(res: TaroGeneral.CallbackResult) => void
    }
    interface ResultCode {
      /** 无权限调用（N22104） */
      4
      /** 订单处理成功 */
      9000
      /** 正在处理中。支付结果未知（有可能已经支付成功） */
      8000
      /** 订单处理失败 */
      4000
      /** 用户中途取消 */
      6001
      /** 网络连接出错 */
      6002
      /** 处理结果未知（有可能已经成功） */
      6004
    }
    interface SuccessCallbackResult {
      /** success 回调函数会携带一个 Object 类型的对象，其属性如下： */
      response: {
        resultCode: ResultCode
      }
    }
  }
  interface TaroStatic {
    /**
     * 此接口可获取支付宝会员的基础信息（头像图片地址、昵称、性别、国家码、省份、所在市区），接入方法请参考 获取会员基础信息介绍。如需获取支付宝会员标识（user_id），请调用 my.getAuthCode 和 alipay.system.oauth.token 接口。
     * @supported alipay
     * @see https://docs.alipay.com/mini/api/ch8chh
     */
    getOpenUserInfo(Option: getOpenUserInfo.Option): Promise<getOpenUserInfo.SuccessCallbackResult>

    /**
     * 此接口是用于发起支付的 API，此 API 暂仅支持企业支付宝小程序使用
     * @supported alipay
     * @see https://opendocs.alipay.com/mini/api/openapi-pay
     */
    tradePay(Option: tradePay.Option): Promise<tradePay.SuccessCallbackResult>
  }
}
