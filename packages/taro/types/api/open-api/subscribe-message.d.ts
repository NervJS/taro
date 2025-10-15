import Taro from '../../index'

declare module '../../index' {
  namespace requestSubscribeMessage {
    interface BaseOption {
      /**
       * 需要订阅的消息模板的id的集合（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
       * @supported weapp, tt
       */
      tmplIds: string[]
      /** 需要订阅的消息模板 id 集合（注意：1、一次性模板 id 和长期性模板 id 不可同时使用，2、一次最多传入三个模板 id
       * @supported alipay
       */
      entityIds: string[]
      /** 模板小程序 appId，仅在服务商代调用场景下需要传入
       * @supported alipay
       */
      thirdTypeAppId?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    type AtLeastOne<T, Keys extends keyof T = keyof T> =
      Keys extends keyof T ? T & Required<Pick<T, Keys>> : never;

    type Option = AtLeastOne<BaseOption, 'tmplIds' | 'entityIds'>;

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
      /** 用户订阅操作结果。
       *
       * | 枚举值 | 描述 |
       * | --- | ---- |
       * | subscribe | 订阅成功 |
       *
       * @supported alipay
       */
      behavior?: string
      /** 一次性订阅，是否勾选 总是保持以上选择，不再询问。
       *
       * | 枚举值 | 描述 |
       * | --- | ---- |
       * | true | 勾选 |
       * | false | 未勾选 |
       *
       * @supported alipay
       */
      keep?: boolean
      /** 长期性订阅，是否点击 拒绝，不再询问。
       *
       * | 枚举值 | 描述 |
       * | --- | ---- |
       * | true | 点击 |
       * | false | 未点击 |
       *
       * @supported alipay
       */
      refuse?: boolean
      /** 订阅数据
       * @supported alipay
       */
      result?: ISubscribeResult
      /** 本次订阅过程是否弹出了订阅面板。
       *
       * | 枚举值 | 描述 |
       * | --- | ---- |
       * | true | 弹出 |
       * | false | 未弹出 |
       *
       * @supported alipay
       */
      show?: boolean
      /** 接口调用成功时errMsg值为'requestSubscribeMessage:ok' */
      errMsg: string
    }

    interface ISubscribeResult {
      /** 订阅成功的模板列表 */
      subscribeEntityIds: string[]
      /** 最终订阅成功的模板列表 */
      subscribedEntityIds: string[]
      /** 未订阅的模板列表 */
      unsubscribedEntityIds: string[]
      /** 本次新增订阅成功的模板列表 */
      currentSubscribedEntityIds: string[]
    }

    /** 模版消息订阅类型 */
    interface TemplateReflex {
      /**
       * 表示用户同意订阅该条id对应的模板消息
       * @supported weapp, alipay, tt
       */
      accept
      /**
       * 表示用户拒绝订阅该条id对应的模板消息
       * @supported weapp, alipay, tt
       */
      reject
      /**
       * 表示已被后台封禁
       * @supported weapp, tt
       */
      ban
      /**
       * 表示该模板因为模板标题同名被后台过滤
       * @supported weapp
       */
      filter
      /** 表示该条 id 对应的模版消息授权失败
       * @supported tt
       */
      fail
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

  namespace unsubscribeMessage {
    interface Option {
      /** 需要取消订阅的消息模板 id 集合（注意：1、一次性模板 id 和长期性模板 id 不可同时使用，2、一次最多传入三个模板 id）。 */
      entityIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
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
     * @supported weapp
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

    /** 取消当前用户已订阅的消息
     * @supported alipay
     * @example
     * ```tsx
     * Taro.unsubscribeMessage({
     *   entityIds: [
     *     'ac768fca1ce245ccae9404bb5243c49b',
     *     '9aa357acb7c6434aba294aded1cdfb7c',
     *   ],
     *   success(res) {
     *     console.log(res);
     *   },
     *   fail(err) {
     *     console.log(err);
     *   }
     * })
     * ```
     * @see https://opendocs.alipay.com/mini/07vg26?pathHash=8c9630ac
     */
    unsubscribeMessage(option: unsubscribeMessage.Option): void

    /** 小程序消息订阅服务，包括取消订阅和查询订阅；订阅操作详见 [form 表单](https://smartprogram.baidu.com/docs/develop/component/formlist_form/)。
     * @supported swan
     * @example
     * ```tsx
     * Taro.subscribeService({
     *   templateId: 'BD0003',
     *   subscribeId: '8026',
     *   type: 'query',
     *   success(res) {
     *     Taro.showModal({
     *       title: 'success',
     *       content: JSON.stringify(res)
     *     })
     *   },
     *   fail(err) {
     *     Taro.showModal({
     *       title: 'fail',
     *       content: JSON.stringify(err)
     *     })
     *   }
     * })
     * ```
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-subscribeService/
     */
    subscribeService(option: subscribeService.Option): void

  }
}
