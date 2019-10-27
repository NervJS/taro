declare namespace Taro {
  /**
   * 生命周期
   */

  namespace getLaunchOptionsSync {
    interface Return {
      /**
       * 启动小程序的路径
       */
      path: string
      /**
       * 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html)
       */
      scene: number
      /**
       * 启动小程序的 query 参数
       */
      query: { [k: string]: any }
      /**
       * shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html)
       */
      shareTicket: string
      /**
       * 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。
       */
      referrerInfo: { appId: string, extraData: { [k: string]: any} }
    }
  }
  /**
   * @since 微信小程序 2.1.2
   *
   * 获取小程序启动时的参数。与 `App.onLaunch` 的回调参数一致。
   *
   * **注意**
   * 部分版本在无 `referrerInfo` 的时候会返回 undefined，
   * 建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
   */
  function getLaunchOptionsSync(): getLaunchOptionsSync.Return

  /**
   * 应用级事件
   */

  namespace onPageNotFound {
    /**
     * 小程序要打开的页面不存在事件的回调函数参数
     */
    interface onPageNotFoundCallbackParam {
      /**
       * 不存在页面的路径
       */
      path: string,
      /**
       * 打开不存在页面的 query 参数
       */
      query: Object,
      /**
       * 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面）
       */
      isEntryPage: boolean
    }
    /**
     * 小程序要打开的页面不存在事件的回调函数
     */
    type onPageNotFoundCallback = (parma: onPageNotFoundCallbackParam) => void
  }
  /**
   * @since 微信小程序 2.1.2
   *
   * 监听小程序要打开的页面不存在事件。该事件与 `App.onPageNotFound` 的回调时机一致
   *
   */
  function onPageNotFound(callback: onPageNotFound.onPageNotFoundCallback): void

  namespace onError {
    interface onErrorParam {
      /**
       * 错误信息，包含堆栈
       */
      error: string
    }

    type onErrorCallback = (param: onErrorParam) => void
  }
  /**
   * @since 微信小程序 2.1.2
   *
   * 监听小程序错误事件。如脚本错误或 API 调用报错等。该事件与 App.onError 的回调时机与参数一致
   */
  function onError(callback: onError.onErrorCallback): void

  /**
   * @since 微信小程序  2.6.2
   *
   * 监听音频中断结束事件。在收到 onAudioInterruptionBegin 事件之后，小程序内所有音频会暂停，收到此事件之后才可再次播放成功
   */
  function onAudioInterruptionEnd(callback: () => void): void

  /**
   * @since 微信小程序  2.6.2
   *
   * 监听音频因为受到系统占用而被中断开始事件。以下场景会触发此事件：闹钟、电话、FaceTime 通话、微信语音聊天、微信视频聊天。此事件触发后，小程序内所有音频会暂停
   */
  function onAudioInterruptionBegin(callback: () => void): void

  // TODO: wx.onAppShow
  // TODO: wx.onAppHide
  // TODO: wx.offPageNotFound
  // TODO: wx.offError
  // TODO: wx.offAudioInterruptionEnd
  // TODO: wx.offAudioInterruptionBegin
  // TODO: wx.offAppShow
  // TODO: wx.offAppHide
}
