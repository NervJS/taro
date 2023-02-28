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
  interface TaroStatic {
    /**
     * 此接口可获取支付宝会员的基础信息（头像图片地址、昵称、性别、国家码、省份、所在市区），接入方法请参考 获取会员基础信息介绍。如需获取支付宝会员标识（user_id），请调用 my.getAuthCode 和 alipay.system.oauth.token 接口。
     * @supported alipay
     * @see https://docs.alipay.com/mini/api/ch8chh
     */
    getOpenUserInfo(Option: getOpenUserInfo.Option): Promise<getOpenUserInfo.SuccessCallbackResult>
  }
}
