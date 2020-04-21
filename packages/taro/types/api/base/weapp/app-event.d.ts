declare namespace Taro {
  namespace onPageNotFound {
    interface Result {
      /** 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面） */
      isEntryPage: boolean
      /** 不存在页面的路径 */
      path: string
      /** 打开不存在页面的 query 参数 */
      query: General.IAnyObject
  }
    /** 小程序要打开的页面不存在事件的回调函数 */
    type Callback = (res: Result) => void
  }
  /**
   * 监听小程序要打开的页面不存在事件。该事件与 [`App.onPageNotFound`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onpagenotfoundobject-object) 的回调时机一致。
   *
   * **注意**
   * - 开发者可以在回调中进行页面重定向，但必须在回调中**同步**处理，异步处理（例如 `setTimeout` 异步执行）无效。
   * - 若开发者没有调用 [Taro.onPageNotFound](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html) 绑定监听，也没有声明 `App.onPageNotFound`，当跳转页面不存在时，将推入微信客户端原生的页面不存在提示页面。
   * - 如果回调中又重定向到另一个不存在的页面，将推入微信客户端原生的页面不存在提示页面，并且不再第二次回调。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html
   */
  function onPageNotFound(callback: onPageNotFound.Callback): void

  namespace onError {
    /** 小程序错误事件的回调函数 */
    type Callback = (
      /** 错误信息，包含堆栈 */
      error: string,
    ) => void
  }
  /** 监听小程序错误事件。如脚本错误或 API 调用报错等。该事件与 [`App.onError`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onerrorstring-error) 的回调时机与参数一致。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html
   */
  function onError(callback: onError.Callback): void

  /**
   * 监听音频中断结束事件。在收到 onAudioInterruptionBegin 事件之后，小程序内所有音频会暂停，收到此事件之后才可再次播放成功
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAudioInterruptionEnd.html
   */
  function onAudioInterruptionEnd (
    /** 音频中断结束事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  /**
   * 监听音频因为受到系统占用而被中断开始事件。以下场景会触发此事件：闹钟、电话、FaceTime 通话、微信语音聊天、微信视频聊天。此事件触发后，小程序内所有音频会暂停。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAudioInterruptionBegin.html
   */
  function onAudioInterruptionBegin(
    /** 音频因为受到系统占用而被中断开始事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  /** 监听小程序切前台事件。该事件与 [`App.onShow`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onshowobject-object) 的回调参数一致。
   *
   * **返回有效 referrerInfo 的场景**
   *
   * | 场景值 | 场景                            | appId含义  |
   * | ------ | ------------------------------- | ---------- |
   * | 1020   | 公众号 profile 页相关小程序列表 | 来源公众号 |
   * | 1035   | 公众号自定义菜单                | 来源公众号 |
   * | 1036   | App 分享消息卡片                | 来源App    |
   * | 1037   | 小程序打开小程序                | 来源小程序 |
   * | 1038   | 从另一个小程序返回              | 来源小程序 |
   * | 1043   | 公众号模板消息                  | 来源公众号 |
   *
   * **注意**
   *
   * 部分版本在无`referrerInfo`的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppShow.html
   */
  function onAppShow(
    /** 小程序切前台事件的回调函数 */
    callback: (result: onAppShow.CallbackResult) => void,
  ): void

  namespace onAppShow {
    interface CallbackResult {
      /** 小程序切前台的路径 */
      path: string
      /** 小程序切前台的 query 参数 */
      query: General.IAnyObject
      /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
      referrerInfo: ResultReferrerInfo
      /** 小程序切前台的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
      scene: number
      /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      shareTicket: string
    }
    /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
    interface ResultReferrerInfo {
      /** 来源小程序、公众号或 App 的 appId */
      appId: string
      /** 来源小程序传过来的数据，scene=1037或1038时支持 */
      extraData: General.IAnyObject
    }
  }
  /** 监听小程序切后台事件。该事件与 [`App.onHide`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onhide) 的回调时机一致。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppHide.html
   */
  function onAppHide(
    /** 小程序切后台事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  /** 取消监听小程序要打开的页面不存在事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offPageNotFound.html
   */
  function offPageNotFound(
    /** 小程序要打开的页面不存在事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  /** 取消监听音频播放错误事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.offError.html
   */
  function offError(
    /** 音频播放错误事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  /** 取消监听音频中断结束事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionEnd.html
   */
  function offAudioInterruptionEnd(
    /** 音频中断结束事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  /** 取消监听音频因为受到系统占用而被中断开始事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionBegin.html
   */
  function offAudioInterruptionBegin(
    /** 音频因为受到系统占用而被中断开始事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  /** 取消监听小程序切前台事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAppShow.html
   */
  function offAppShow(
    /** 小程序切前台事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  /** 取消监听小程序切后台事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAppHide.html
   */
  function offAppHide(
    /** 小程序切后台事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
}
