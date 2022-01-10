import Taro from '../../index'

declare module '../../index' {
  namespace updateShareMenu {
    interface Option {
      /** 动态消息的 activityId。通过 [updatableMessage.createActivityId](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/updatable-message/updatableMessage.createActivityId.html) 接口获取 */
      activityId?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 是否是动态消息，详见[动态消息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share/updatable-message.html) */
      isUpdatableMessage?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 动态消息的模板信息 */
      templateInfo?: UpdatableMessageFrontEndTemplateInfo
      /** 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      withShareTicket?: boolean
    }

    /** 动态消息的模板信息 */
    interface UpdatableMessageFrontEndTemplateInfo {
      /** 参数列表 */
      parameterList: UpdatableMessageFrontEndParameter[]
    }
    /** 参数列表 */
    interface UpdatableMessageFrontEndParameter {
      /** 参数名 */
      name: string
      /** 参数值 */
      value: string
    }
  }

  namespace showShareMenu {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      withShareTicket?: boolean
      /** QQ小程序分享功能，支持分享到QQ、QQ空间、微信好友、微信朋友圈
      * 支持的值： ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
      * @supported qq
      */
      showShareItems?: string[]
    }
  }

  namespace hideShareMenu {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getShareInfo {
    interface Option {
      /** shareTicket */
      shareTicket: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 超时时间，单位 ms */
      timeout?: number
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud) */
      cloudID?: string
      /** 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) */
      encryptedData: string
      /** 错误信息 */
      errMsg: string
      /** 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html) */
      iv: string
    }
  }

  interface TaroStatic {
    /** 更新转发属性
     * @supported weapp
     * @example
     * ```tsx
     * Taro.updateShareMenu({
     *   withShareTicket: true,
     *   success () { }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html
     */
    updateShareMenu(option: updateShareMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 显示当前页面的转发按钮
     * @supported weapp
     * @example
     * ```tsx
     * Taro.showShareMenu({
     *   withShareTicket: true
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html
     */
    showShareMenu(option: showShareMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 隐藏转发按钮
     * @supported weapp
     * @example
     * ```tsx
     * Taro.hideShareMenu()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html
     */
    hideShareMenu(option?: hideShareMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 获取转发详细信息
     *
     * **Tips**
     * - 如需要展示群名称，可以使用[开放数据组件](https://developers.weixin.qq.com/miniprogram/dev/component/open-ability/open-data.html)
     * @supported weapp
     * @example
     * 敏感数据有两种获取方式，一是使用 [加密数据解密算法]((open-ability/signature#加密数据解密算法)) 。
     * 获取得到的开放数据为以下 json 结构（其中 openGId 为当前群的唯一标识）：
     * ```json
     * {
     *  "openGId": "OPENGID"
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html
     */
    getShareInfo(option: getShareInfo.Option): Promise<getShareInfo.SuccessCallbackResult>
  }
}
