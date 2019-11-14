declare namespace Taro {
  /** 创建激励视频广告组件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/wx.createRewardedVideoAd.html
   */
  function createRewardedVideoAd (option: createRewardedVideoAd.Option): RewardedVideoAd
  namespace createRewardedVideoAd {
    interface Option {
      /** 广告单元 id */
      adUnitId: string
      /** 是否启用多例模式
       * @default false
       */
      multiton?: boolean
    }
  }
  /** 创建插屏广告组件。
   * 请通过 getSystemInfoSync 返回对象的 SDKVersion 判断基础库版本号后再使用该 API。每次调用该方法创建插屏广告都会返回一个全新的实例（小程序端的插屏广告实例不允许跨页面使用）。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/wx.createInterstitialAd.html
   */
  function createInterstitialAd (option: createInterstitialAd.Option): InterstitialAd

  namespace createInterstitialAd {
    interface Option {
      /** 广告单元 id */
      adUnitId: string
    }
  }
  
  interface InterstitialAd {
    /** 销毁插屏广告实例。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.destroy.html
     */
    destroy(): void
    /** 取消监听插屏广告关闭事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offClose.html
     */
    offClose(callback: InterstitialAd.OffCloseCallback): void
    /** 取消监听插屏错误事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offError.html
     */
    offError(callback: InterstitialAd.OffErrorCallback): void
    /** 取消监听插屏广告加载事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offLoad.html
     */
    offLoad(callback: InterstitialAd.OffLoadCallback): void
    /** 监听插屏广告关闭事件。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onClose.html
     */
    onClose(callback: InterstitialAd.OnCloseCallback): void
    /** 监听插屏错误事件。
     *
     * **错误码信息与解决方案表**
     *
     *
     *  错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
     *  在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。
     *
     * | 代码 | 异常情况 | 理由 | 解决方案 |
     * | ------ | -------------- | --------------- | -------------------------- |
     * | 1000  | 后端错误调用失败  | 该项错误不是开发者的异常情况 | 一般情况下忽略一段时间即可恢复。 |
     * | 1001  | 参数错误    | 使用方法错误 | 可以前往developers.weixin.qq.com确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。|
     * | 1002  | 广告单元无效    | 可能是拼写错误、或者误用了其他APP的广告ID | 请重新前往mp.weixin.qq.com确认广告位ID。 |
     * | 1003  | 内部错误    | 该项错误不是开发者的异常情况 | 一般情况下忽略一段时间即可恢复。|
     * | 1004  | 无适合的广告   | 广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告 | 属于正常情况，且开发者需要针对这种情况做形态上的兼容。 |
     * | 1005  | 广告组件审核中  | 你的广告正在被审核，无法展现广告 | 请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。|
     * | 1006  | 广告组件被驳回  | 你的广告审核失败，无法展现广告 | 请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。|
     * | 1007  | 广告组件被驳回  | 你的广告能力已经被封禁，封禁期间无法展现广告 | 请前往mp.weixin.qq.com确认小程序广告封禁状态。 |
     * | 1008  | 广告单元已关闭  | 该广告位的广告能力已经被关闭 | 请前往mp.weixin.qq.com重新打开对应广告位的展现。|
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onError.html
     */
    onError(callback: InterstitialAd.OnErrorCallback): void
    /** 监听插屏广告加载事件。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onLoad.html
     */
    onLoad(callback: InterstitialAd.OnLoadCallback): void
    /** 加载插屏广告。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.load.html
     */
    load(): Promise<any>
    /** 显示插屏广告。
     *
     * **错误码信息表**
     *
     *
     *  如果插屏广告显示失败，InterstitialAd.show() 方法会返回一个rejected Promise，开发者可以获取到错误码及对应的错误信息。
     *
     * | 代码 | 异常情况 | 理由 |
     * | ------ | -------------- | -------------------------- |
     * | 2001  | 触发频率限制  | 小程序启动一定时间内不允许展示插屏广告 |
     * | 2002  | 触发频率限制  | 距离小程序插屏广告或者激励视频广告上次播放时间间隔不足，不允许展示插屏广告 |
     * | 2003  | 触发频率限制  | 当前正在播放激励视频广告或者插屏广告，不允许再次展示插屏广告 |
     * | 2004  | 广告渲染失败  | 该项错误不是开发者的异常情况，或因小程序页面切换导致广告渲染失败 |
     * | 2005  | 广告调用异常  | 插屏广告实例不允许跨页面调用 |
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.show.html
     */
    show(): Promise<any>
  }
  namespace InterstitialAd {
    /** 插屏广告关闭事件的回调函数 */
    type OffCloseCallback = (res: General.CallbackResult) => void
    /** 插屏错误事件的回调函数 */
    type OffErrorCallback = (res: General.CallbackResult) => void
    /** 插屏广告加载事件的回调函数 */
    type OffLoadCallback = (res: General.CallbackResult) => void
    /** 插屏广告关闭事件的回调函数 */
    type OnCloseCallback = (res: General.CallbackResult) => void
    /** 插屏错误事件的回调函数 */
    type OnErrorCallback = (result: OnErrorCallbackResult) => void
    /** 插屏广告加载事件的回调函数 */
    type OnLoadCallback = (res: General.CallbackResult) => void
    interface OnErrorCallbackResult {
      errCode: keyof errCode
      /** 错误信息 */
      errMsg: string
    }
    /** 错误码 */
    type errCode = {
      1000: '后端接口调用失败'
      1001: '参数错误'
      1002: '广告单元无效'
      1003: '内部错误'
      1004: '无合适的广告'
      1005: '广告组件审核中'
      1006: '广告组件被驳回'
      1007: '广告组件被封禁'
      1008: '广告单元已关闭'
      // [key: number]: string
    }
  }

  interface RewardedVideoAd {
    /** 加载激励视频广告。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.load.html
     */
    load(): Promise<any>
    /** 显示激励视频广告。激励视频广告将从屏幕下方推入。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.show.html
     */
    show(): Promise<any>
    /** 销毁激励视频广告实例。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.destroy.html
     */
    destroy(): void
    /** 取消监听用户点击 `关闭广告` 按钮的事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offClose.html
     */
    offClose(callback: RewardedVideoAd.OffCloseCallback): void
    /** 取消监听激励视频错误事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offError.html
     */
    offError(callback: RewardedVideoAd.OffErrorCallback): void
    /** 取消监听激励视频广告加载事件
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offLoad.html
     */
    offLoad(callback: RewardedVideoAd.OffLoadCallback): void
    /** 监听用户点击 `关闭广告` 按钮的事件。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onClose.html
     */
    onClose(callback: RewardedVideoAd.OnCloseCallback): void
    /** 监听激励视频错误事件。
     *
     * **错误码信息与解决方案表**
     *
     *
     *  错误码是通过onError获取到的错误信息。调试期间，可以通过异常返回来捕获信息。
     *  在小程序发布上线之后，如果遇到异常问题，可以在[“运维中心“](https://mp.weixin.qq.com/)里面搜寻错误日志，还可以针对异常返回加上适当的监控信息。
     *
     * | 代码 | 异常情况 | 理由 | 解决方案 |
     * | ------ | -------------- | --------------- | -------------------------- |
     * | 1000  | 后端错误调用失败  | 该项错误不是开发者的异常情况 | 一般情况下忽略一段时间即可恢复。 |
     * | 1001  | 参数错误    | 使用方法错误 | 可以前往developers.weixin.qq.com确认具体教程（小程序和小游戏分别有各自的教程，可以在顶部选项中，“设计”一栏的右侧进行切换。|
     * | 1002  | 广告单元无效    | 可能是拼写错误、或者误用了其他APP的广告ID | 请重新前往mp.weixin.qq.com确认广告位ID。 |
     * | 1003  | 内部错误    | 该项错误不是开发者的异常情况 | 一般情况下忽略一段时间即可恢复。|
     * | 1004  | 无适合的广告   | 广告不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览广告 | 属于正常情况，且开发者需要针对这种情况做形态上的兼容。 |
     * | 1005  | 广告组件审核中  | 你的广告正在被审核，无法展现广告 | 请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。|
     * | 1006  | 广告组件被驳回  | 你的广告审核失败，无法展现广告 | 请前往mp.weixin.qq.com确认审核状态，且开发者需要针对这种情况做形态上的兼容。|
     * | 1007  | 广告组件被驳回  | 你的广告能力已经被封禁，封禁期间无法展现广告 | 请前往mp.weixin.qq.com确认小程序广告封禁状态。 |
     * | 1008  | 广告单元已关闭  | 该广告位的广告能力已经被关闭 | 请前往mp.weixin.qq.com重新打开对应广告位的展现。|
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onError.html
     */
    onError(callback: RewardedVideoAd.OnErrorCallback): void
    /** 监听激励视频广告加载事件。
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onLoad.html
     */
    onLoad(callback: RewardedVideoAd.OnLoadCallback): void
  }
  namespace RewardedVideoAd {
    interface OnErrorCallbackResult {
      /** 错误码
       *
       * 可选值：
       * - 1000: 后端接口调用失败;
       * - 1001: 参数错误;
       * - 1002: 广告单元无效;
       * - 1003: 内部错误;
       * - 1004: 无合适的广告;
       * - 1005: 广告组件审核中;
       * - 1006: 广告组件被驳回;
       * - 1007: 广告组件被封禁;
       * - 1008: 广告单元已关闭;
       */
      errCode: 1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008
      /** 错误信息 */
      errMsg: string
    }
    interface OnCloseCallbackResult {
      /** 视频是否是在用户完整观看的情况下被关闭的 */
      isEnded: boolean
    }
    /** 用户点击 `关闭广告` 按钮的事件的回调函数 */
    type OffCloseCallback = (res: General.CallbackResult) => void
    /** 激励视频错误事件的回调函数 */
    type OffErrorCallback = (res: General.CallbackResult) => void
    /** 激励视频广告加载事件的回调函数 */
    type OffLoadCallback = (res: General.CallbackResult) => void
    /** 用户点击 `关闭广告` 按钮的事件的回调函数 */
    type OnCloseCallback = (result: OnCloseCallbackResult) => void
    /** 激励视频错误事件的回调函数 */
    type OnErrorCallback = (result: OnErrorCallbackResult) => void
    /** 激励视频广告加载事件的回调函数 */
    type OnLoadCallback = (res: General.CallbackResult) => void
  }
}
