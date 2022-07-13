import Taro from '../../index'

declare module '../../index' {
  namespace openSetting {
    interface Option {
      /**
       * 是否同时获取用户订阅消息的订阅状态，默认不获取。注意：withSubscriptions 只返回用户勾选过订阅面板中的“总是保持以上选择，不再询问”的订阅消息。
       */
      withSubscriptions?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用户授权结果 */
      authSetting: AuthSetting
      /** 用户订阅消息设置，接口参数 withSubscriptions 值为 true 时才会返回。 */
      subscriptionsSetting: SubscriptionsSetting
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace getSetting {
    interface Option {
      /**
       * 是否同时获取用户订阅消息的订阅状态，默认不获取。注意：withSubscriptions 只返回用户勾选过订阅面板中的“总是保持以上选择，不再询问”的订阅消息。
       */
      withSubscriptions?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用户授权结果 */
      authSetting: AuthSetting
      /** 用户订阅消息设置，接口参数 withSubscriptions 值为 true 时才会返回。 */
      subscriptionsSetting: SubscriptionsSetting
      /** 在插件中调用时，当前宿主小程序的用户授权结果 */
      miniprogramAuthSetting: AuthSetting
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 用户授权设置信息，详情参考[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
   * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
  */
  interface AuthSetting {
    /** 是否授权用户信息，对应接口 [Taro.getUserInfo](/docs/apis/open-api/user-info/getUserInfo) */
    'scope.userInfo'?: boolean
    /** 是否授权地理位置，对应接口 [Taro.getLocation](/docs/apis/location/getLocation), [Taro.chooseLocation](/docs/apis/location/chooseLocation) */
    'scope.userLocation'?: boolean
    /** 是否授权通讯地址，对应接口 [Taro.chooseAddress](/docs/apis/open-api/address/chooseAddress) */
    'scope.address'?: boolean
    /** 是否授权发票抬头，对应接口 [Taro.chooseInvoiceTitle](/docs/apis/open-api/invoice/chooseInvoiceTitle) */
    'scope.invoiceTitle'?: boolean
    /** 是否授权获取发票，对应接口 [Taro.chooseInvoice](/docs/apis/open-api/invoice/chooseInvoice) */
    'scope.invoice'?: boolean
    /** 是否授权微信运动步数，对应接口 [Taro.getWeRunData](/docs/apis/open-api/werun/getWeRunData) */
    'scope.werun'?: boolean
    /** 是否授权录音功能，对应接口 [Taro.startRecord](/docs/apis/media/recorder/startRecord) */
    'scope.record'?: boolean
    /** 是否授权保存到相册 [Taro.saveImageToPhotosAlbum](/docs/apis/media/image/saveImageToPhotosAlbum), [Taro.saveVideoToPhotosAlbum](/docs/apis/media/video/saveVideoToPhotosAlbum) */
    'scope.writePhotosAlbum'?: boolean
    /** 是否授权摄像头，对应 [camera](/docs/components/media/camera) 组件 */
    'scope.camera'?: boolean
    /** 是否授权小程序在后台运行蓝牙，对应接口 [Taro.openBluetoothAdapterBackground](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/(wx.openBluetoothAdapterBackground).html) */
    'scope.bluetoothBackground'?: boolean
  }

  /** 订阅消息设置
   *
   * 注意事项
   * - itemSettings 只返回用户勾选过订阅面板中的“总是保持以上选择，不再询问”的订阅消息。
   * @example
   * ```tsx
   * Taro.getSetting({
   *   withSubscriptions: true,
   *   success (res) {
   *     console.log(res.authSetting)
   *     // res.authSetting = {
   *     //   "scope.userInfo": true,
   *     //   "scope.userLocation": true
   *     // }
   *     console.log(res.subscriptionsSetting)
   *     // res.subscriptionsSetting = {
   *     //   mainSwitch: true, // 订阅消息总开关
   *     //   itemSettings: {   // 每一项开关
   *     //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
   *     //     SYS_MSG_TYPE_RANK: 'accept'
   *     //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
   *     //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
   *     //   }
   *     // }
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/SubscriptionsSetting.html
  */
  interface SubscriptionsSetting {
    /** 订阅消息总开关，true 为开启，false 为关闭 */
    mainSwitch: boolean
    /** 每一项订阅消息的订阅状态。itemSettings对象的键为一次性订阅消息的模板id或系统订阅消息的类型
     * - 一次性订阅消息使用方法详见 [Taro.requestSubscribeMessage](/docs/apis/open-api/subscribe-message/requestSubscribeMessage)
     * - 永久订阅消息（仅小游戏可用）使用方法详见 [Taro.requestSubscribeSystemMessage](https://developers.weixin.qq.com/minigame/dev/api/open-api/subscribe-message/wx.requestSubscribeSystemMessage.html)
     * @type "accept" | "reject" | "ban"
     */
    itemSettings: {
      [TEMPLATE_ID: string]: keyof SubscriptionsSetting.TemplateReflex | string
    }
  }

  namespace SubscriptionsSetting {
    /** 模版消息订阅类型 */
    interface TemplateReflex {
      /** 表示用户同意订阅该条id对应的模板消息 */
      accept
      /** 表示用户拒绝订阅该条id对应的模板消息 */
      reject
      /** 表示已被后台封禁 */
      ban
    }
  }

  interface TaroStatic {
    /** 调起客户端小程序设置界面，返回用户设置的操作结果。**设置界面只会出现小程序已经向用户请求过的[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)**。
     *
     * 注意：[2.3.0](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 版本开始，用户发生点击行为后，才可以跳转打开设置页，管理授权信息。[详情](https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008)
     * @supported weapp, rn, tt
     * @example
     * ```tsx
     * Taro.openSetting({
     *   success: function (res) {
     *     console.log(res.authSetting)
     *     // res.authSetting = {
     *     //   "scope.userInfo": true,
     *     //   "scope.userLocation": true
     *     // }
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html
     */
    openSetting(option?: openSetting.Option): Promise<openSetting.SuccessCallbackResult>

    /** 获取用户的当前设置。**返回值中只会出现小程序已经向用户请求过的[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)**。
     * @supported weapp, rn, tt
     * @example
     * ```tsx
     * Taro.getSetting({
     *   success: function (res) {
     *     console.log(res.authSetting)
     *     // res.authSetting = {
     *     //   "scope.userInfo": true,
     *     //   "scope.userLocation": true
     *     // }
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
     */
    getSetting(option?: getSetting.Option): Promise<getSetting.SuccessCallbackResult>
  }
}
