import Taro from '../../index'

declare module '../../index' {
  /** EntryList 对象
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.html
   */
  interface EntryList {
    /** 该方法返回当前列表中的所有性能数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.getEntries.html
     */
    getEntries(): PerformanceEntry[]
    /** 获取当前列表中所有名称为 [name] 且类型为 [entryType] 的性能数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.getEntriesByName.html
     */
    getEntriesByName(name: string, entryType: string): PerformanceEntry[]
    /** 获取当前列表中所有类型为 [entryType] 的性能数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.getEntriesByType.html
     */
    getEntriesByType(entryType: string): PerformanceEntry[]
  }

  /** Performance 对象，用于获取性能数据及创建性能监听器
   * @supported weapp, tt
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.html
   */
  interface Performance {
    /** 创建全局性能事件监听器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.createObserver.html
     */
    createObserver(callback: TaroGeneral.TFunc): PerformanceObserver
    /** 该方法返回当前缓冲区中的所有性能数据
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.getEntries.html
     */
    getEntries(): PerformanceEntry[]
    /** 获取当前缓冲区中所有名称为 [name] 且类型为 [entryType] 的性能数据
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.getEntriesByName.html
     */
    getEntriesByName(name: string, entryType: string): PerformanceEntry[]
    /** 获取当前缓冲区中所有类型为 [entryType] 的性能数据
     * @supported weapp, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.getEntriesByType.html
     */
    getEntriesByType(entryType: string): PerformanceEntry[]
    /** 设置缓冲区大小，默认缓冲 30 条性能数据
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.setBufferSize.html
     */
    setBufferSize(size: number): void
  }

  /** 单条性能数据
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceEntry.html
   */
  interface PerformanceEntry {
    /** 指标类型 */
    entryType: keyof PerformanceEntry.EntryType
    /** 指标名称 */
    name: keyof PerformanceEntry.EntryName
    /** 开始时间，不同指标的具体含义会有差异 */
    startTime: number
    /** 耗时 ms。仅对于表示阶段的指标有效。 */
    duration: number
    /** 页面路径。仅 render 和 navigation 类型指标有效。 */
    path: string
    /** 路由真正响应开始时间。仅 navigation 类型指标有效。 */
    navigationStart: number
    /** 路由详细类型，与小程序路由方法对应。仅 navigation 类型指标有效。 */
    navigationType: string
    /** 分包名，主包表示为 APP。仅 evaluateScript 指标有效。 */
    moduleName: string
    /** 注入文件列表。仅 evaluateScript 指标有效。 */
    fileList: string[]
    /** 渲染层代码注入完成时间。仅 firstRender 指标有效。 */
    viewLayerReadyTime: number
    /** 首次渲染参数从逻辑层发出的时间。仅 firstRender 指标有效。 */
    initDataSendTime: number
    /** 首次渲染参数在渲染层收到的时间。仅 firstRender 指标有效。 */
    initDataRecvTime: number
    /** 渲染层执行渲染开始时间。仅 firstRender 指标有效。 */
    viewLayerRenderStartTime: number
    /** 渲染层执行渲染结束时间。仅 firstRender 指标有效。 */
    viewLayerRenderEndTime: number
  }

  /** PerformanceObserver 对象，用于监听性能相关事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceObserver.html
   */
  interface PerformanceObserver {
    /** 获取当前支持的所有性能指标类型 */
    supportedEntryTypes: PerformanceEntry[]
    /** 停止监听
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceObserver.disconnect.html
     */
    disconnect(): void
    /** 开始监听
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceObserver.observe.html
     */
    observe(option: PerformanceObserver.observe.Option): void
  }

  namespace PerformanceEntry {
    /** entryType 的合法值 */
    interface EntryType {
      /** 路由 */
      navigation
      /** 渲染 */
      render
      /** 脚本 */
      script
    }
    /** name 的合法值 */
    interface EntryName {
      /** 小程序启动耗时。起点为用户点击小程序图标，或小程序被拉起的时间；终点为首页 onReady。(entryType: navigation) */
      appLaunch
      /** 路由处理耗时。(entryType: navigation) */
      route
      /** 页面首次渲染耗时。起点为逻辑层收到路由事件，包括逻辑层页面与组件初始化、VD 同步、渲染层执行渲染的时间；终点为首页 onReady。(entryType: render) */
      firstRender
      /** [页面首次绘制](https://developer.mozilla.org/en-US/docs/Glossary/First_paint)。第一个像素渲染到屏幕上所用的时间。(entryType: render) */
      firstPaint
      /** [页面首次内容绘制](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)。第一块内容渲染到屏幕上所用的时间。(entryType: render) */
      firstContentfulPaint
      /** 逻辑层 JS 代码注入耗时。(entryType: script) */
      evaluateScript
    }
  }

  namespace PerformanceObserver {
    namespace observe {
      interface Option {
        /** 指标类型。不能和 entryTypes 同时使用 */
        type: keyof EntryType
        /** 指标类型列表。不能和 type 同时使用。 */
        entryTypes: (keyof EntryType)[]
      }
      interface EntryType {
        /** 路由 */
        navigation
        /** 渲染 */
        render
        /** 脚本 */
        script
      }
    }
  }

  namespace preloadWebview {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace preloadSkylineView {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace preloadAssets {
    interface AssetsObjectType {
      /** 字体 */
      font
      /** 图片 */
      image
    }
    interface AssetsObject {
      /** 类型 */
      type: keyof AssetsObjectType
      /** 资源地址 */
      src: string
    }
    interface Option {
      data: AssetsObject[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 小程序测速上报。使用前，需要在小程序管理后台配置。 详情参见[小程序测速](https://developers.weixin.qq.com/miniprogram/dev/framework/performanceReport/index.html)指南。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.reportPerformance(1101, 680)
     * Taro.reportPerformance(1101, 680, 'custom')
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.reportPerformance.html
     */
    reportPerformance(
      /** 指标 id */
      id: number,
      /** 需要上报的数值 */
      value: number,
      /** 自定义维度 */
      dimensions?: string | string[],
    ): void

    /** 预加载下个页面的 WebView
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.preloadWebview.html
     */
    preloadWebview(option: preloadWebview.Option): Promise<TaroGeneral.CallbackResult>

    /**预加载下个页面所需要的 Skyline 运行环境
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.preloadSkylineView.html
     */
    preloadSkylineView(option: preloadSkylineView.Option): Promise<TaroGeneral.CallbackResult>

    /** 为视图层预加载媒体资源文件, 目前支持：font，image
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.preloadAssets.html
     */
    preloadAssets(option: preloadAssets.Option): Promise<TaroGeneral.CallbackResult>
    /** 小程序测速上报。使用前，需要在小程序管理后台配置。 详情参见[小程序测速](https://developers.weixin.qq.com/miniprogram/dev/framework/performanceReport/index.html)指南。
     *
     * **注意**
     *  - 目前，当开启代码 [按需注入](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/lazyload.html) `时，evaluateScript` 将仅包含公有部分代码，页面和组件的代码注入的时间会包含在 `firstRender` 中（因为页面和组件的代码注入过程成为了首次渲染过程的一部分）。因此开启按需注入后，脚本耗时降低，渲染时间提高属于正常现象，优化效果可以关注整体启动耗时（`appLaunch`）来评估。
     *  - `firstPaint` 和 `firstContentfulPaint` 指标在开启 `vconsole` 的情况下，由于绘制 `vconsoel` 的面板，会导致数据提前。
     * @supported weapp, tt
     * @example
     * ```tsx
     * const performance = Taro.getPerformance()
     * const observer = performance.createObserver((entryList) => {
     *   console.log(entryList.getEntries())
     * })
     * observer.observe({ entryTypes: ['render', 'script', 'navigation'] })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.getPerformance.html
     */
    getPerformance(): Performance
  }
}
