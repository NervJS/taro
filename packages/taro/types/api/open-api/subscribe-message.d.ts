import Taro from '../../index'

declare module '../../index' {
  namespace requestSubscribeMessage {
    interface Option {
      /** 需要订阅的消息模板的id的集合（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置 */
      tmplIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 接口调用失败错误码 */
      errCode: number
      /** 接口调用失败错误信息 */
      errMsg: string
    }

    /**
     * @example
     * 表示用户同意订阅 zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE 这条消息
     *
     * ```json
     * {
     *   "errMsg": "requestSubscribeMessage:ok",
     *   "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
     * }
     * ```
     */
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 动态的键，即模板id
       * @name [TEMPLATE_ID]
       * @type "accept" | "reject" | "ban"
       */
      [TEMPLATE_ID: string]: keyof TemplateReflex | string
      /** 接口调用成功时errMsg值为'requestSubscribeMessage:ok' */
      errMsg: string
    }

    /** 模版消息订阅类型 */
    interface TemplateReflex {
      /** 表示用户同意订阅该条id对应的模板消息 */
      accept
      /** 表示用户拒绝订阅该条id对应的模板消息 */
      reject
      /** 表示已被后台封禁 */
      ban
      /** 表示该模板因为模板标题同名被后台过滤 */
      filter
    }
  }

  namespace requestSubscribeDeviceMessage {
    interface Option {
      /** 需要订阅的消息模板的 id 的集合，一次调用最多可订阅3条消息 */
      tmplIds: string[]
      /** 设备唯一序列号。由厂商分配，长度不能超过128字节。字符只接受数字，大小写字母，下划线（_）和连字符（-）。 */
      sn: string
      /** 设备票据，5分钟内有效。 */
      snTicket: string
      /** 设备型号 id 。通过微信公众平台注册设备获得。 */
      modelId: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface FailCallbackResult extends TaroGeneral.CallbackResult {
      /** 接口调用失败错误码，有可能为空 */
      errCode: number
      /** 接口调用失败错误信息 */
      errMsg: string
    }

    /**
     * @example
     * 表示用户同意订阅 zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE 这条消息
     * ```json
     * {
     *   "errMsg": "requestSubscribeDeviceMessage:ok",
     *   "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
     * }
     * ```
     */
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** [TEMPLATE_ID]是动态的键，即模板id
       * @name [TEMPLATE_ID]
       * @type "accept" | "reject" | "ban" | "filter" | "acceptWithAudio"
       */
      [TEMPLATE_ID: string]: keyof TemplateReflex | string
      /** 接口调用成功时errMsg值为'requestSubscribeMessage:ok' */
      errMsg: string
    }

    /** 模版消息订阅类型 */
    interface TemplateReflex {
      /** 表示用户同意订阅该条id对应的模板消息 */
      accept
      /** 表示用户拒绝订阅该条id对应的模板消息 */
      reject
      /** 表示已被后台封禁 */
      ban
      /** 表示该模板因为模板标题同名被后台过滤 */
      filter
      /** 表示用户接收订阅消息并开启了语音提醒 */
      acceptWithAudio
    }
  }

  interface TaroStatic {
    /** 请求订阅消息
     *
     * 注意：[2.8.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 版本开始，用户发生点击行为或者发起支付回调后，才可以调起订阅消息界面。
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.requestSubscribeMessage({
     *   tmplIds: [''],
     *   success: function (res) { }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html
     */
    requestSubscribeMessage(
      option: requestSubscribeMessage.Option
    ): Promise<requestSubscribeMessage.SuccessCallbackResult | requestSubscribeMessage.FailCallbackResult>

    /** 订阅设备消息接口，调用后弹出授权框，用户同意后会允许开发者给用户发送订阅模版消息。当用户点击“允许”按钮时，模板消息会被添加到用户的小程序设置页，通过 wx.getSetting 接口可获取用户对相关模板消息的订阅状态。
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.requestSubscribeDeviceMessage({
     *   tmplIds: ['xxxxx'],
     *   sn: 'xxxx',
     *   snTicket: 'xxxxx',
     *   modelId: 'xxx',
     *   success(res) {
     *     console.log(res)
     *   },
     *   fail(res) {
     *     console.log(res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeDeviceMessage.html
     */
     requestSubscribeDeviceMessage(
      option: requestSubscribeDeviceMessage.Option
    ): Promise<requestSubscribeDeviceMessage.SuccessCallbackResult | requestSubscribeDeviceMessage.FailCallbackResult>
  }
}
