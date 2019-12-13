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
  
  /**
   * 插屏广告组件。插屏广告组件是一个原生组件，层级比普通组件高。插屏广告组件每次创建都会返回一个全新的实例（小程序端的插屏广告实例不允许跨页面使用），默认是隐藏的，需要调用 InterstitialAd.show() 将其显示。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.html
   */
  interface InterstitialAd {
    /** 销毁插屏广告实例。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.destroy.html
     */
    destroy(): void
    /** 取消监听插屏广告关闭事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offClose.html
     */
    offClose(callback: InterstitialAd.OffCloseCallback): void
    /** 取消监听插屏错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offError.html
     */
    offError(callback: InterstitialAd.OffErrorCallback): void
    /** 取消监听插屏广告加载事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.offLoad.html
     */
    offLoad(callback: InterstitialAd.OffLoadCallback): void
    /** 监听插屏广告关闭事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onClose.html
     */
    onClose(callback: InterstitialAd.OnCloseCallback): void
    /** 监听插屏错误事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onError.html
     */
    onError(callback: InterstitialAd.OnErrorCallback): void
    /** 监听插屏广告加载事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.onLoad.html
     */
    onLoad(callback: InterstitialAd.OnLoadCallback): void
    /** 加载插屏广告。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/InterstitialAd.load.html
     */
    load(): Promise<any>
    /** 显示插屏广告。
     * 
     * **错误码信息表**
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
     * @supported weapp
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
    interface OnErrorCallbackResult extends General.CallbackResult {
      /** 错误码
       * @see https://nervjs.github.io/taro/docs/apis/General#AdErrCode
       */
      errCode: keyof General.AdErrCode
      /** 错误信息 */
      errMsg: string
    }
  }

  /**
   * 激励视频广告组件。激励视频广告组件是一个原生组件，层级比普通组件高。激励视频广告是一个单例（小游戏端是全局单例，小程序端是页面内单例，在小程序端的单例对象不允许跨页面使用），默认是隐藏的，需要调用 RewardedVideoAd.show() 将其显示。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.html
   */
  interface RewardedVideoAd {
    /** 加载激励视频广告。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.load.html
     */
    load(): Promise<any>
    /** 显示激励视频广告。激励视频广告将从屏幕下方推入。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.show.html
     */
    show(): Promise<any>
    /** 销毁激励视频广告实例。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.destroy.html
     */
    destroy(): void
    /** 取消监听用户点击 `关闭广告` 按钮的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offClose.html
     */
    offClose(callback: RewardedVideoAd.OffCloseCallback): void
    /** 取消监听激励视频错误事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offError.html
     */
    offError(callback: RewardedVideoAd.OffErrorCallback): void
    /** 取消监听激励视频广告加载事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.offLoad.html
     */
    offLoad(callback: RewardedVideoAd.OffLoadCallback): void
    /** 监听用户点击 `关闭广告` 按钮的事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onClose.html
     */
    onClose(callback: RewardedVideoAd.OnCloseCallback): void
    /** 
     * 监听激励视频错误事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onError.html
     */
    onError(callback: RewardedVideoAd.OnErrorCallback): void
    /** 监听激励视频广告加载事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ad/RewardedVideoAd.onLoad.html
     */
    onLoad(callback: RewardedVideoAd.OnLoadCallback): void
  }
  namespace RewardedVideoAd {
    interface OnErrorCallbackResult extends General.CallbackResult {
      /** 错误码
       * @see https://nervjs.github.io/taro/docs/apis/General#AdErrCode
       */
      errCode: keyof General.AdErrCode
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
