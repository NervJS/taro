import Taro from '../../index'

declare module '../../index' {
  namespace switchTab {
    interface Option {
      /** 需要跳转的 tabBar 页面的路径（需在 app.json 的 [tabBar](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabbar) 字段定义的页面），路径后不能带参数。 */
      url: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace reLaunch {
    interface Option {
      /** 需要跳转的应用内页面路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2' */
      url: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace redirectTo {
    interface Option {
      /** 需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 `?` 分隔，参数键与参数值用 `=` 相连，不同参数用 `&` 分隔；如 'path?key=value&key2=value2' */
      url: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace navigateTo {
    interface Option {
      /** 需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 `?` 分隔，参数键与参数值用 `=` 相连，不同参数用 `&` 分隔；如 'path?key=value&key2=value2' */
      url: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 页面间通信接口，用于监听被打开页面发送到当前页面的数据。 */
      events?: TaroGeneral.IAnyObject
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult & { eventChannel: EventChannel }) => void
    }
  }

  namespace navigateBack {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 返回的页面数，如果 delta 大于现有页面数，则返回到首页。 */
      delta?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  /** 页面间事件通信通道
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.html
   */
  interface EventChannel {
    /** 触发一个事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.emit.html
     */
    emit(
      /** 事件名称 */
      eventName: string,
      /** 事件参数 */
      ...args: any
    ): void
    /** 持续监听一个事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.on.html
     */
    on(
      /** 事件名称 */
      eventName: string,
      /** 事件监听函数 */
      fn: TaroGeneral.EventCallback,
    ): void
    /** 监听一个事件一次，触发后失效
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.once.html
     */
    once(
      /** 事件名称 */
      eventName: string,
      /** 事件监听函数 */
      fn: TaroGeneral.EventCallback,
    ): void
    /** 取消监听一个事件。给出第二个参数时，只取消给出的监听函数，否则取消所有监听函数
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/EventChannel.off.html
     */
    off(
      /** 事件名称 */
      eventName: string,
      /** 事件监听函数 */
      fn: TaroGeneral.EventCallback,
    ): void
  }

  interface TaroStatic {
    /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```json
     * {
     *   "tabBar": {
     *     "list": [{
     *       "pagePath": "index",
     *       "text": "首页"
     *     },{
     *       "pagePath": "other",
     *       "text": "其他"
     *     }]
     *   }
     * }
     * ```
     *
     * ```tsx
     * Taro.switchTab({
     *   url: '/index'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
     */
    switchTab(option: switchTab.Option): Promise<TaroGeneral.CallbackResult>

    /** 关闭所有页面，打开到应用内的某个页面
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.reLaunch({
     *   url: 'test?id=1'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html
     */
    reLaunch(option: reLaunch.Option): Promise<TaroGeneral.CallbackResult>

    /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @h5 未针对 tabbar 页面做限制处理
     * @example
     * ```tsx
     * Taro.redirectTo({
     *   url: 'test?id=1'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html
     */
    redirectTo(option: redirectTo.Option): Promise<TaroGeneral.CallbackResult>

    /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Taro.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @h5 未针对 tabbar 页面做限制处理
     * @example
     * ```tsx
     * Taro.navigateTo({
     *   url: 'test?id=1',
     *   events: {
     *     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
     *     acceptDataFromOpenedPage: function(data) {
     *       console.log(data)
     *     },
     *     someEvent: function(data) {
     *       console.log(data)
     *     }
     *     ...
     *   },
     *   success: function (res) {
     *     // 通过eventChannel向被打开页面传送数据
     *     res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
     */
    navigateTo(option: navigateTo.Option): Promise<TaroGeneral.CallbackResult>

    /** 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @h5 若入参 delta 大于现有页面数时，返回应用打开的第一个页面（如果想要返回首页请使用 reLaunch 方法）。
     * @example
     * ```tsx
     * // 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码
     * // 此处是A页面
     * Taro.navigateTo({
     *   url: 'B?id=1'
     * })
     * // 此处是B页面
     * Taro.navigateTo({
     *   url: 'C?id=1'
     * })
     * // 在C页面内 navigateBack，将返回A页面
     * Taro.navigateBack({
     *   delta: 2
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html
     */
    navigateBack(option?: navigateBack.Option): Promise<TaroGeneral.CallbackResult>
  }
}
