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
       * @supported weapp, qq
       * @qq QQ支持的值： ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
       * @weapp 微信支持：['wechatFriends', 'wechatMoment'] / ['shareAppMessage', 'shareTimeline']
       */
      showShareItems?: string[]
    }
  }

  namespace showShareImageMenu {
    interface Option {
      /** 要分享的图片地址，必须为本地路径或临时路径 */
      path: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace shareVideoMessage {
    interface Option {
      /** 要分享的视频地址，必须为本地路径或临时路径 */
      videoPath: string
      /** 缩略图路径，若留空则使用视频首帧 */
      thumbPath?: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace shareFileMessage {
    interface Option {
      /** 要分享的视频地址，必须为本地路径或临时路径 */
      filePath: string
      /** 自定义文件名，若留空则使用 filePath 中的文件名 */
      fileName?: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }
  namespace onCopyUrl {
    /** 用户点击右上角菜单的「复制链接」按钮时触发的事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** 用短链打开小程序时当前页面携带的查询字符串。小程序中使用时，应在进入页面时调用 `Taro.onCopyUrl` 自定义 `query`，退出页面时调用 `Taro.offCopyUrl`，防止影响其它页面。 */
      query: string
    }
  }

  namespace hideShareMenu {
    interface Option {
      /** 本接口为 Beta 版本，暂只在 Android 平台支持。需要隐藏的转发按钮名称列表，默认['shareAppMessage', 'shareTimeline']。按钮名称合法值包含 "shareAppMessage"、"shareTimeline" 两种 */
      menus?: string[]
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace getShareInfo {
    interface Option {
      /** shareTicket */
      shareTicket: string
      /** 超时时间，单位 ms */
      timeout?: number
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
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

  namespace authPrivateMessage {
    interface Option {
      /** shareTicket */
      shareTicket: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
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
    updateShareMenu (option: updateShareMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 显示当前页面的转发按钮
     * @supported weapp, qq, tt
     * @example
     * ```tsx
     * Taro.showShareMenu({
     *   withShareTicket: true
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html
     */
    showShareMenu (option: showShareMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
     * @supported weapp
     * @example
     * ```tsx
     * Taro.downloadFile({
     *   url: 'https://res.wx.qq.com/wxdoc/dist/assets/img/demo.ef5c5bef.jpg',
     *   success: (res) => {
     *     Taro.showShareImageMenu({
     *       path: res.tempFilePath
     *     })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareImageMenu.html
     */
    showShareImageMenu (option: showShareImageMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 转发视频到聊天
     * @supported weapp
     * @example
     * callback 写法
     *
     * ```tsx
     * Taro.downloadFile({
     *   url: URL, // 下载url
     *   success (res) {
     *     // 下载完成后转发
     *     Taro.shareVideoMessage({
     *       videoPath: res.tempFilePath,
     *       success() {},
     *       fail: console.error,
     *     })
     *   },
     *   fail: console.error,
     * })
     * ```
     *
     * async await 写法
     *
     * ```tsx
     * const { tempFilePath } = await Taro.downloadFile({
     *   url: URL, // 下载url
     * })
     * // 下载完成后转发
     * await Taro.shareVideoMessage({
     *   videoPath: res.tempFilePath,
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.shareVideoMessage.html
     */
    shareVideoMessage (option: shareVideoMessage.Option): Promise<TaroGeneral.CallbackResult>

    /** 转发文件到聊天
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.shareFileMessage.html
     */
    shareFileMessage (option: shareFileMessage.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听用户点击右上角菜单的「复制链接」按钮时触发的事件
     *
     * > 本接口为 Beta 版本，暂只在 Android 平台支持。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.onCopyUrl.html
     */
    onCopyUrl (
      /** 用户点击右上角菜单的「复制链接」按钮时触发的事件的回调函数 */
      callback: onCopyUrl.Callback,
    ): void

    /** 取消监听用户点击右上角菜单的「复制链接」按钮时触发的事件
     *
     * > 本接口为 Beta 版本，暂只在 Android 平台支持。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.offCopyUrl.html
     */
    offCopyUrl (
      /** 用户点击右上角菜单的「复制链接」按钮时触发的事件的回调函数 */
      callback: onCopyUrl.Callback,
    ): void

    /** 隐藏当前页面的转发按钮
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.hideShareMenu()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html
     */
    hideShareMenu (option?: hideShareMenu.Option): Promise<TaroGeneral.CallbackResult>

    /** 获取转发详细信息
     *
     * **Tips**
     * - 如需要展示群名称，可以使用[开放数据组件](/docs/components/open/open-data)
     * @supported weapp
     * @example
     * 敏感数据有两种获取方式，一是使用 [加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95) 。
     * 获取得到的开放数据为以下 json 结构（其中 openGId 为当前群的唯一标识）：
     * ```json
     * {
     *  "openGId": "OPENGID"
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html
     */
    getShareInfo (option: getShareInfo.Option): Promise<getShareInfo.SuccessCallbackResult>

    /** 验证私密消息
     * @supported weapp
     * @example
     * ```tsx
     * Taro.authPrivateMessage({
     *   shareTicket: 'xxxxxx',
     *   success(res) {
     *     console.log('authPrivateMessage success', res)
     *     // res
     *     // {
     *     //   errMsg: 'authPrivateMessage:ok'
     *     //   valid: true
     *     //   iv: 'xxxx',
     *     //   encryptedData: 'xxxxxx'
     *     // }
     *   },
     *   fail(res) {
     *     console.log('authPrivateMessage fail', res)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.authPrivateMessage.html
     */
    authPrivateMessage (option: authPrivateMessage.Option): Promise<authPrivateMessage.SuccessCallbackResult>
  }
}
