import Taro from '../../index'

declare module '../../index' {
  // 周期性更新

  namespace setBackgroundFetchToken {
    interface Option {
      /** 自定义的登录态 */
      token: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace onBackgroundFetchData {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }

    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 缓存数据类别，取值为 periodic 或 pre */
      fetchType: string
      /** 缓存数据 */
      fetchedData: string
      /** 客户端拿到缓存数据的时间戳 */
      timeStamp: number
      /** 小程序页面路径 */
      path: string
      /** 传给页面的 query 参数 */
      query: string
      /** 进入小程序的场景值 */
      scene: number
    }
  }

  namespace getBackgroundFetchToken {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 自定义的登录态 */
      token: string
      /** 接口调用结果 */
      errMsg: string
    }
  }

  namespace getBackgroundFetchData {
    interface Option {
      /** 缓存数据类别
       * @weapp 取值为 periodic
       * @qq 取值为 periodic
       * @alipay 取值为 pre: 数据预拉取; jsapiPre: API 预调用（目前仅支持地理位置预拉取）
       */
      fetchType: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 缓存数据
       *  @alipay Object
       */
      fetchedData: string | Object
      /** 客户端拿到缓存数据的时间戳 ms。(iOS 时间戳存在异常，8.0.27 修复) */
      timeStamp: number
      /** 小程序页面路径 */
      path: string
      /** 传给页面的 query 参数 */
      query: string
      /** 进入小程序的场景值 */
      scene: number
      /** 缓存数据类型，与入参 fetchType 一致
       * @supported alipay
       */
      fetchType?: string
      /** 缓存数据的时间戳。单位：ms。
       * @supported alipay
       */
      timestamp?: number
    }
  }

  interface TaroStatic {
    /** 设置自定义登录态，在周期性拉取数据时带上，便于第三方服务器验证请求合法性
     * @supported weapp, qq
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.setBackgroundFetchToken.html
     */
    setBackgroundFetchToken(option: setBackgroundFetchToken.Option): Promise<TaroGeneral.CallbackResult>

    /** 收到 backgroundFetch 数据时的回调
     * @supported weapp, qq
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.onBackgroundFetchData.html
     */
    onBackgroundFetchData(option?: onBackgroundFetchData.Option | onBackgroundFetchData.Callback): void

    /** 获取设置过的自定义登录态。若无，则返回 fail。
     * @supported weapp, qq
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.getBackgroundFetchToken.html
     */
    getBackgroundFetchToken(option?: getBackgroundFetchToken.Option): Promise<TaroGeneral.CallbackResult>

    /** 拉取 backgroundFetch 客户端缓存数据
     * @supported weapp, alipay, qq
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/background-fetch/wx.getBackgroundFetchData.html
     */
    getBackgroundFetchData(option: getBackgroundFetchData.Option): Promise<getBackgroundFetchData.SuccessCallbackResult>
  }
}
