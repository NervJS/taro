declare namespace Taro {
  namespace chooseInvoiceTitle {
    type Promised = {
      /**
       * 抬头类型（0：单位，1：个人）
       */
      type: string
      /**
       * 抬头名称
       */
      title: string
      /**
       * 抬头税号
       */
      taxNumber: string
      /**
       * 单位地址
       */
      companyAddress: string
      /**
       * 手机号码
       */
      telephone: string
      /**
       * 银行名称
       */
      bankName: string
      /**
       * 银行账号
       */
      bankAccount: string
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 选择用户的发票抬头。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.invoiceTitle
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseInvoiceTitle({
     success(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html
   */
  function chooseInvoiceTitle(OBJECT?: chooseInvoiceTitle.Param): Promise<chooseInvoiceTitle.Promised>

  namespace chooseInvoice {
    type Promised = {
      /**
       * 所选发票卡券的 cardId
       */
      cardId: string
      /**
       * 所选发票卡券的加密 code，报销方可以通过 cardId 和 encryptCode 获得报销发票的信息。
       */
      encryptCode: string
      /**
       * 发票方的 appId
       */
      publisherAppId: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 选择用户的发票抬头。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.invoice
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseInvoice({
     success(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html
   */
  function chooseInvoice(OBJECT?: chooseInvoice.Param): Promise<chooseInvoice.Promised>
}
