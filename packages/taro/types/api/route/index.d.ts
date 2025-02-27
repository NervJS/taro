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
      /** 页面间通信接口，用于监听被打开页面发送到当前页面的数据。 */
      events?: TaroGeneral.IAnyObject
      /** 2.29.2 自定义路由类型 */
      routeType?: string
      /** 3.4.0 自定义路由配置 */
      routeConfig?: TaroGeneral.IAnyObject
      /** 3.4.0 自定义路由参数 */
      routeOptions?: TaroGeneral.IAnyObject
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
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

  namespace router {
    type CustomRouteBuilder = (routeContext: CustomRouteContext, routeOptions: Record<string, any>) => CustomRouteConfig

    interface SharedValue<T> {
      value: T
    }

    interface CustomRouteContext {
      // 动画控制器，影响推入页面的进入和退出过渡效果
      primaryAnimation: SharedValue<number>
      // 动画控制器状态
      primaryAnimationStatus: SharedValue<number>
      // 动画控制器，影响栈顶页面的推出过渡效果
      secondaryAnimation: SharedValue<number>
      // 动画控制器状态
      secondaryAnimationStatus: SharedValue<number>
      // 当前路由进度由手势控制
      userGestureInProgress: SharedValue<number>
      // 手势开始控制路由
      startUserGesture: () => void
      // 手势不再控制路由
      stopUserGesture: () => void
      // 返回上一级，效果同 wx.navigateBack
      didPop: () => void
    }

    interface CustomRouteConfig {
      // 下一个页面推入后，不显示前一个页面
      opaque?: boolean
      // 是否保持前一个页面状态
      maintainState?: boolean
      // 页面推入动画时长，单位 ms
      transitionDuration?: number
      // 页面推出动画时长，单位 ms
      reverseTransitionDuration?: number
      // 遮罩层背景色，支持 rgba() 和 #RRGGBBAA 写法
      barrierColor?: string
      // 点击遮罩层返回上一页
      barrierDismissible?: boolean
      // 无障碍语义
      barrierLabel?: string
      // 是否与下一个页面联动，决定当前页 secondaryAnimation 是否生效
      canTransitionTo?: boolean
      // 是否与前一个页面联动，决定前一个页 secondaryAnimation 是否生效
      canTransitionFrom?: boolean
      // 处理当前页的进入/退出动画，返回 StyleObject
      handlePrimaryAnimation?: RouteAnimationHandler
      // 处理当前页的压入/压出动画，返回 StyleObject
      handleSecondaryAnimation?: RouteAnimationHandler
      // 处理上一级页面的压入/压出动画，返回 StyleObject 基础库 <3.0.0> 起支持
      handlePreviousPageAnimation?: RouteAnimationHandler
      // 页面进入时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
      allowEnterRouteSnapshotting?: boolean
      // 页面退出时是否采用 snapshot 模式优化动画性能 基础库 <3.2.0> 起支持
      allowExitRouteSnapshotting?: boolean
      // 右滑返回时，可拖动范围是否撑满屏幕，基础库 <3.2.0> 起支持，常用于半屏弹窗
      fullscreenDrag?: boolean
      // 返回手势方向 基础库 <3.4.0> 起支持
      popGestureDirection?: 'horizontal' | 'vertical' | 'multi'
    }

    type RouteAnimationHandler = () => { [key: string] : any}

    /** 自定义路由
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/router/wx.router.html
     */
    interface router {
      /** 添加自定义路由配置
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/router/base/router.addRouteBuilder.html
       */
      addRouteBuilder(
        /** 路由类型 */
        routeType: string,
        /** 路由动画定义函数 */
        routeBuilder: CustomRouteBuilder
      ): void
      /** 获取页面对应的自定义路由上下文对象
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/router/base/router.getRouteContext.html
       */
      getRouteContext(
        /** 页面/自定义组件实例 */
        instance: TaroGeneral.IAnyObject
      ): CustomRouteContext
      /** 移除自定义路由配置
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/router/base/router.removeRouteBuilder.html
       */
      removeRouteBuilder(
        /** 路由类型 */
        routeType: string,
      ): void
    }
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
     * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
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
     * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
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
     * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
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
     * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
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
    router: router.router
  }
}
