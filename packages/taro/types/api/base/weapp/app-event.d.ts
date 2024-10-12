import Taro from '../../../index'

declare module '../../../index' {
  namespace onPageNotFound {
    interface Result {
      /** 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面） */
      isEntryPage: boolean
      /** 不存在页面的路径 */
      path: string
      /** 打开不存在页面的 query 参数 */
      query: TaroGeneral.IAnyObject
    }
    /** 小程序要打开的页面不存在事件的回调函数 */
    type Callback = (res: Result) => void
  }

  namespace onError {
    /** 小程序错误事件的回调函数 */
    type Callback = (
      /** 错误信息，包含堆栈 */
      error: string | ErrorEvent | Error,
    ) => void
  }

  namespace onAppShow {
    interface CallbackResult {
      /** 小程序切前台的路径 */
      path: string
      /** 小程序切前台的 query 参数 */
      query: TaroGeneral.IAnyObject
      /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
      shareTicket: string
      /** 小程序切前台的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
      scene: number
      /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
      referrerInfo: ResultReferrerInfo
      /** 打开的文件信息数组，只有从聊天素材场景打开（scene为1173）才会携带该参数 */
      forwardMaterials?: ForwardMaterial[]
      /** 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型 */
      chatType?: keyof ChatType
      /** API 类别 */
      apiCategory?: keyof ApiCategory
    }
    /** 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意) */
    interface ResultReferrerInfo {
      /** 来源小程序、公众号或 App 的 appId */
      appId?: string
      /** 来源小程序传过来的数据，scene=1037或1038时支持 */
      extraData?: TaroGeneral.IAnyObject
    }
    /** ChatType 类型合法值 */
    interface ForwardMaterial {
      /** 文件的mimetype类型 */
      type: string
      /** 文件名 */
      name: string
      /** 文件路径（如果是webview则是url） */
      path: string
      /** 文件大小 */
      size: number
    }
    /** ChatType 类型合法值 */
    interface ChatType {
      /** 微信联系人单聊 */
      1
      /** 企业微信联系人单聊 */
      2
      /** 普通微信群聊 */
      3
      /** 企业微信互通群聊 */
      4
    }
    /** API 类别合法值 */
    interface ApiCategory {
      /** 默认类别 */
      default
      /** 原生功能化，视频号直播商品、商品橱窗等场景打开的小程序 */
      nativeFunctionalized
      /** 仅浏览，朋友圈快照页等场景打开的小程序 */
      browseOnly
      /** 内嵌，通过打开半屏小程序能力打开的小程序 */
      embedded
    }
  }

  namespace onUnhandledRejection {
    type Callback<T = any> = (res: Result<T>) => void
    type Result<T = any> = {
      /** 拒绝原因，一般是一个 Error 对象 */
      reason: string | Error
      /** 被拒绝的 Promise 对象 */
      promise: Promise<T>
    }
  }

  namespace onThemeChange {
    /** 系统主题改变事件的回调函数 */
    type Callback = (res: Result) => void
    interface Result {
      /** 系统当前的主题，取值为`light`或`dark` */
      theme: keyof ITheme
    }
    interface ITheme {
      /** 浅色主题 */
      light
      /** 深色主题 */
      dark
    }
  }

  interface TaroStatic {
    /** 监听未处理的 Promise 拒绝事件。该事件与 [`App.onUnhandledRejection`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onUnhandledRejection-Object-object) 的回调时机与参数一致。
     *
     * **注意**
     *  - 所有的 unhandledRejection 都可以被这一监听捕获，但只有 Error 类型的才会在小程序后台触发报警。
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onUnhandledRejection.html
     */
    onUnhandledRejection<T = any>(callback: onUnhandledRejection.Callback<T>): void

    /** 监听系统主题改变事件。该事件与 [`App.onThemeChange`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onThemeChange-Object-object) 的回调时机一致。
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onThemeChange.html
     */
    onThemeChange(callback: onThemeChange.Callback): void

    /**
     * 监听小程序要打开的页面不存在事件。该事件与 [`App.onPageNotFound`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onpagenotfoundobject-object) 的回调时机一致。
     *
     * **注意**
     * - 开发者可以在回调中进行页面重定向，但必须在回调中**同步**处理，异步处理（例如 `setTimeout` 异步执行）无效。
     * - 若开发者没有调用 [Taro.onPageNotFound](/docs/apis/base/weapp/app-event/onPageNotFound) 绑定监听，也没有声明 `App.onPageNotFound`，当跳转页面不存在时，将推入微信客户端原生的页面不存在提示页面。
     * - 如果回调中又重定向到另一个不存在的页面，将推入微信客户端原生的页面不存在提示页面，并且不再第二次回调。
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html
     */
    onPageNotFound(callback: onPageNotFound.Callback): void

    /** 监听小程序错误事件。如脚本错误或 API 调用报错等。该事件与 [`App.onError`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onerrorstring-error) 的回调时机与参数一致。
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html
     */
    onError(callback: onError.Callback): void

    /**
     * 监听音频中断结束事件。在收到 onAudioInterruptionBegin 事件之后，小程序内所有音频会暂停，收到此事件之后才可再次播放成功
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAudioInterruptionEnd.html
     */
    onAudioInterruptionEnd (
      /** 音频中断结束事件的回调函数 */
      callback: (res: TaroGeneral.CallbackResult) => void,
    ): void

    /**
     * 监听音频因为受到系统占用而被中断开始事件。以下场景会触发此事件：闹钟、电话、FaceTime 通话、微信语音聊天、微信视频聊天。此事件触发后，小程序内所有音频会暂停。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAudioInterruptionBegin.html
     */
    onAudioInterruptionBegin(
      /** 音频因为受到系统占用而被中断开始事件的回调函数 */
      callback: (res: TaroGeneral.CallbackResult) => void,
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
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppShow.html
     */
    onAppShow(
      /** 小程序切前台事件的回调函数 */
      callback: (res: onAppShow.CallbackResult) => void,
    ): void

    /** 监听小程序切后台事件。该事件与 [`App.onHide`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onhide) 的回调时机一致。
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppHide.html
     */
    onAppHide(
      /** 小程序切后台事件的回调函数 */
      callback: (res: onAppShow.CallbackResult) => void,
    ): void

    /** 取消监听未处理的 Promise 拒绝事件
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offUnhandledRejection.html
     */
    offUnhandledRejection<T = any>(callback: onUnhandledRejection.Callback<T>): void

    /** 取消监听系统主题改变事件
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offThemeChange.html
     */
    offThemeChange(callback: onThemeChange.Callback): void

    /** 取消监听小程序要打开的页面不存在事件
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offPageNotFound.html
     */
    offPageNotFound(
      /** 小程序要打开的页面不存在事件的回调函数 */
      callback: onPageNotFound.Callback,
    ): void

    /** 取消监听音频播放错误事件
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.offError.html
     */

    offError(
      /** 音频播放错误事件的回调函数 */
      callback: onError.Callback,
    ): void

    /** 取消监听音频中断结束事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionEnd.html
     */
    offAudioInterruptionEnd(
      /** 音频中断结束事件的回调函数 */
      callback: (res: TaroGeneral.CallbackResult) => void,
    ): void

    /** 取消监听音频因为受到系统占用而被中断开始事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAudioInterruptionBegin.html
     */
    offAudioInterruptionBegin(
      /** 音频因为受到系统占用而被中断开始事件的回调函数 */
      callback: (res: TaroGeneral.CallbackResult) => void,
    ): void

    /** 取消监听小程序切前台事件
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAppShow.html
     */
    offAppShow(
      /** 小程序切前台事件的回调函数 */
      callback: (res: onAppShow.CallbackResult) => void,
    ): void

    /** 取消监听小程序切后台事件
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.offAppHide.html
     */
    offAppHide(
      /** 小程序切后台事件的回调函数 */
      callback: (res: onAppShow.CallbackResult) => void,
    ): void
  }
}
