import Taro from '../../index'

declare module '../../index' {
  namespace chooseInvoiceTitle {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 银行账号 */
      bankAccount: string
      /** 银行名称 */
      bankName: string
      /** 单位地址 */
      companyAddress: string
      /** 错误信息 */
      errMsg: string
      /** 抬头税号 */
      taxNumber: string
      /** 手机号码 */
      telephone: string
      /** 抬头名称 */
      title: string
      /** 抬头类型 */
      type: keyof InvoiceType
    }

    /** 抬头类型 */
    interface InvoiceType {
      0: '单位'
      1: '个人'
    }
  }

  namespace chooseInvoice {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用户选中的发票信息，格式为一个 JSON 字符串，包含三个字段： card_id：所选发票卡券的 cardId，encrypt_code：所选发票卡券的加密 code，报销方可以通过 cardId 和 encryptCode 获得报销发票的信息，app_id： 发票方的 appId。 */
      invoiceInfo: string
      /** 调用结果 */
      errMsg: string
    }
  }

  interface TaroStatic {
    /** 选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了[微信认证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1496554031_RD4xe)的，才能调用 chooseInvoiceTitle。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.chooseInvoiceTitle({
     *   success: function(res) {}
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html
     */
    chooseInvoiceTitle(option?: chooseInvoiceTitle.Option): Promise<chooseInvoiceTitle.SuccessCallbackResult>

    /** 选择用户已有的发票。
     *
     * **通过 cardId 和 encryptCode 获得报销发票的信息**
     * 请参考[微信电子发票文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=21517918939oae3U)中，「查询报销发票信息」部分。
     * 其中 `access_token` 的获取请参考[auth.getAccessToken](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html)文档
     * @supported weapp
     * @example
     * ```tsx
     * Taro.chooseInvoice({
     *   success: function (res) {}
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html
     */
    chooseInvoice(option?: chooseInvoice.Option): Promise<chooseInvoice.SuccessCallbackResult>
  }
}
