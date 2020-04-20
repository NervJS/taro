declare namespace Taro {
  namespace requestSubscribeMessage {
    type Promised = ErrorPromised & {
      /**
       * [TEMPLATE_ID] 是动态的键，即模板 id，值包括 'accept'、'reject'、'ban'。
       * `'accept'` 表示用户同意订阅该条 id 对应的模板消息，
       * `'reject'` 表示用户拒绝订阅该条 id 对应的模板消息，
       * `'ban'` 表示已被后台封禁。
       * 例如
       * ```js
       * { errMsg: "requestSubscribeMessage:ok", zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: "accept" }
       * ```
       * 表示用户同意订阅 zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE 这条消息
       */
      [TEMPLATE_ID: string]: 'accept' | 'reject' | 'ban'
    }
    type ErrorPromised = {
      /**
       * 接口调用失败错误信息，接口调用成功时 errMsg 值为 'requestSubscribeMessage:ok'
       */
      errMsg: string
      /**
       * 接口调用失败错误码
       */
      errCode?: number
    }
    type Param = {
      /**
       * 需要订阅的消息模板的 id 的集合
       * **注意：** iOS 客户端 7.0.6 版本、Android 客户端 7.0.7 版本之后的一次性订阅/长期订阅才支持多个模板消息，
       * iOS 客户端 7.0.5 版本、Android 客户端 7.0.6 版本之前的一次订阅只支持一个模板消息）
       * 消息模板 id 在[[微信公众平台](mp.weixin.qq.com)-功能-订阅消息]中配置
       */
      tmplIds: string[]
      /**
       * 接口调用成功的回调函数
       */
      success?: SuccessProp
      /**
       * 接口调用失败的回调函数
       */
      fail?: FailProp
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: CompleteProp
    }
    type SuccessProp = (res: Promised) => void
    type FailProp = (err: Promised) => void
    type CompleteProp = (res: Promised) => void
  }
  /**
   * 请求订阅消息
   * @param {requestSubscribeMessage.Param} OBJECT 请求订阅消息参数
   * 
   * **注意：** 2.8.2 版本开始，用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。
   * 
   * **示例代码**
   ```js
   wx.requestSubscribeMessage({
     tmplIds: [ 'zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE' ],
     success (res) { 
       var key =  res.zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE
       var msg = res.errMsg
     }
   })
   ```
   * @since 2.8.2
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
   */
  function requestSubscribeMessage(OBJECT: requestSubscribeMessage.Param): Promise<requestSubscribeMessage.Promised>
}
