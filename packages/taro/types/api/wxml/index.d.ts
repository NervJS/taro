import Taro from '../../index'

declare module '../../index' {
  namespace createIntersectionObserver {
    /** 选项 */
    interface Option {
      /** 初始的相交比例，如果调用时检测到的相交比例与这个值不相等且达到阈值，则会触发一次监听器的回调函数。 */
      initialRatio?: number
      /** 是否同时观测多个目标节点（而非一个），如果设为 true ，observe 的 targetSelector 将选中多个节点（注意：同时选中过多节点将影响渲染性能） */
      observeAll?: boolean
      /** 一个数值数组，包含所有阈值。 */
      thresholds?: number[]
    }
  }

  /** `IntersectionObserver` 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.html
   */
  interface IntersectionObserver {
    /** 停止监听。回调函数将不再触发
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.disconnect.html
     */
    disconnect(): void
    /** 指定目标节点并开始监听相交状态变化情况
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.observe.html
     */
    observe(
      /** 选择器 */
      targetSelector: string,
      /** 监听相交状态变化的回调函数 */
      callback: IntersectionObserver.ObserveCallback,
    ): void
    /** 使用选择器指定一个节点，作为参照区域之一。
     * @supported weapp, tt, h5, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.relativeTo.html
     */
    relativeTo(
      /** 选择器 */
      selector: string,
      /** 用来扩展（或收缩）参照节点布局区域的边界 */
      margins?: IntersectionObserver.RelativeToMargins,
    ): IntersectionObserver
    /** 指定页面显示区域作为参照区域之一
     * @supported weapp, tt, h5, harmony_hybrid
     * @example
     * 下面的示例代码中，如果目标节点（用选择器 .target-class 指定）进入显示区域以下 100px 时，就会触发回调函数。
     *
     * ```tsx
     * Taro.createIntersectionObserver().relativeToViewport({bottom: 100}).observe('.target-class', (res) => {
     *   res.intersectionRatio // 相交区域占目标节点的布局区域的比例
     *   res.intersectionRect // 相交区域
     *   res.intersectionRect.left // 相交区域的左边界坐标
     *   res.intersectionRect.top // 相交区域的上边界坐标
     *   res.intersectionRect.width // 相交区域的宽度
     *   res.intersectionRect.height // 相交区域的高度
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.relativeToViewport.html
     */
    relativeToViewport(
      /** 用来扩展（或收缩）参照节点布局区域的边界 */
      margins?: IntersectionObserver.RelativeToViewportMargins,
    ): IntersectionObserver
  }

  namespace IntersectionObserver {
    /** 监听相交状态变化的回调函数 */
    type ObserveCallback = (result: ObserveCallbackResult) => void
    interface ObserveCallbackResult {
      /** 目标边界 */
      boundingClientRect: BoundingClientRectResult
      /** 相交比例 */
      intersectionRatio: number
      /** 相交区域的边界 */
      intersectionRect: IntersectionRectResult
      /** 参照区域的边界 */
      relativeRect: RelativeRectResult
      /** 相交检测时的时间戳 */
      time: number
    }
    /** 参照区域的边界 */
    interface RelativeRectResult {
      /** 下边界 */
      bottom: number
      /** 左边界 */
      left: number
      /** 右边界 */
      right: number
      /** 上边界 */
      top: number
    }
    /** 相交区域的边界 */
    interface IntersectionRectResult {
      /** 下边界 */
      bottom: number
      /** 高度 */
      height: number
      /** 左边界 */
      left: number
      /** 右边界 */
      right: number
      /** 上边界 */
      top: number
      /** 宽度 */
      width: number
    }
    /** 目标边界 */
    interface BoundingClientRectResult {
      /** 下边界 */
      bottom: number
      /** 高度 */
      height: number
      /** 左边界 */
      left: number
      /** 右边界 */
      right: number
      /** 上边界 */
      top: number
      /** 宽度 */
      width: number
    }
    /** 用来扩展（或收缩）参照节点布局区域的边界 */
    interface RelativeToMargins {
      /** 节点布局区域的下边界 */
      bottom?: number
      /** 节点布局区域的左边界 */
      left?: number
      /** 节点布局区域的右边界 */
      right?: number
      /** 节点布局区域的上边界 */
      top?: number
    }
    /** 用来扩展（或收缩）参照节点布局区域的边界 */
    interface RelativeToViewportMargins {
      /** 节点布局区域的下边界 */
      bottom?: number
      /** 节点布局区域的左边界 */
      left?: number
      /** 节点布局区域的右边界 */
      right?: number
      /** 节点布局区域的上边界 */
      top?: number
    }
  }

  /** `MediaQueryObserver` 对象，用于监听页面 media query 状态的变化，如界面的长宽是不是在某个指定的范围内。 */
  interface MediaQueryObserver {
    /** 开始监听页面 media query 变化情况 */
    observe(descriptor: MediaQueryObserver.descriptor, callback: MediaQueryObserver.observeCallback): void
    /** 停止监听。回调函数将不再触发 */
    disconnect(): void
  }

  namespace MediaQueryObserver {
    /** media query 描述符 */
    interface descriptor {
      /** 页面最小宽度 (单位: px) */
      minWidth: number
      /** 页面最大宽度 (单位: px) */
      maxWidth: number
      /** 页面宽度 (单位: px) */
      width: number
      /** 页面最小高度 (单位: px) */
      minHeight: number
      /** 页面最大高度（px 为单位） */
      maxHeight: number
      /** 页面高度（px 为单位） */
      height: number
      /** 屏幕方向 */
      orientation: 'landscape' | 'portrait'
    }

    /** 监听 media query 状态变化的回调函数 */
    type observeCallback = (res: {
      /** 页面的当前状态是否满足所指定的 media query */
      matches: boolean
    }) => void
  }

  /** 用于获取 `WXML` 节点信息的对象
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.html
   */
  interface NodesRef {
    /** 添加节点的布局位置的查询请求。相对于显示区域，以像素为单位。其功能类似于 DOM 的 `getBoundingClientRect`。返回 `NodesRef` 对应的 `SelectorQuery`。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
     *   rect.id      // 节点的ID
     *   rect.dataset // 节点的dataset
     *   rect.left    // 节点的左边界坐标
     *   rect.right   // 节点的右边界坐标
     *   rect.top     // 节点的上边界坐标
     *   rect.bottom  // 节点的下边界坐标
     *   rect.width   // 节点的宽度
     *   rect.height  // 节点的高度
     * }).exec()
     * @example
     * ```
     * ```tsx
     * Taro.createSelectorQuery().selectAll('.a-class').boundingClientRect(function(rects){
     *   rects.forEach(function(rect){
     *     rect.id      // 节点的ID
     *     rect.dataset // 节点的dataset
     *     rect.left    // 节点的左边界坐标
     *     rect.right   // 节点的右边界坐标
     *     rect.top     // 节点的上边界坐标
     *     rect.bottom  // 节点的下边界坐标
     *     rect.width   // 节点的宽度
     *     rect.height  // 节点的高度
     *   })
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.boundingClientRect.html
     */
    boundingClientRect(
      /** 回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。 */
      callback?: NodesRef.BoundingClientRectCallback,
    ): SelectorQuery
    /** 添加节点的 Context 对象查询请求。目前支持 [VideoContext](/docs/apis/media/video/VideoContext)、[CanvasContext](/docs/apis/canvas/CanvasContext)、[LivePlayerContext](/docs/apis/media/live/LivePlayerContext)、[EditorContext](/docs/apis/media/editor/EditorContext)和 [MapContext](/docs/apis/media/map/MapContext) 的获取。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().select('.the-video-class').context(function (res) {
     *   console.log(res.context) // 节点对应的 Context 对象。如：选中的节点是 <video> 组件，那么此处即返回 VideoContext 对象
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.context.html
     */
    context(
      /** 回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。 */
      callback?: NodesRef.ContextCallback,
    ): SelectorQuery
    /** 获取节点的相关信息。需要获取的字段在fields中指定。返回值是 `nodesRef` 对应的 `selectorQuery`
     *
     * **注意**
     * computedStyle 的优先级高于 size，当同时在 computedStyle 里指定了 width/height 和传入了 size: true，则优先返回 computedStyle 获取到的 width/height。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().select('#the-id').fields({
     *   dataset: true,
     *   size: true,
     *   scrollOffset: true,
     *   properties: ['scrollX', 'scrollY'],
     *   computedStyle: ['margin', 'backgroundColor'],
     *   context: true,
     * }, function (res) {
     *   res.dataset    // 节点的dataset
     *   res.width      // 节点的宽度
     *   res.height     // 节点的高度
     *   res.scrollLeft // 节点的水平滚动位置
     *   res.scrollTop  // 节点的竖直滚动位置
     *   res.scrollX    // 节点 scroll-x 属性的当前值
     *   res.scrollY    // 节点 scroll-y 属性的当前值
     *   // 此处返回指定要返回的样式名
     *   res.margin
     *   res.backgroundColor
     *   res.context    // 节点对应的 Context 对象
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.fields.html
     */
    fields(
      fields: NodesRef.Fields,
      /** 回调函数 */
      callback?: NodesRef.FieldsCallback,
    ): SelectorQuery
    /** 获取 Node 节点实例。目前支持 [Canvas](/docs/components/canvas) 的获取。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().select('.canvas').node(function(res){
     *   console.log(res.node) // 节点对应的 Canvas 实例。
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.node.html
     */
    node(
      /** 回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。 */
      callback?: NodesRef.NodeCallback,
    ): SelectorQuery
    /** 添加节点的滚动位置查询请求。以像素为单位。节点必须是 `scroll-view` 或者 `viewport`，返回 `NodesRef` 对应的 `SelectorQuery`。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().selectViewport().scrollOffset(function(res){
     *   res.id      // 节点的ID
     *   res.dataset // 节点的dataset
     *   res.scrollLeft // 节点的水平滚动位置
     *   res.scrollTop  // 节点的竖直滚动位置
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.scrollOffset.html
     */
    scrollOffset(
      /** 回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。 */
      callback?: NodesRef.ScrollOffsetCallback,
    ): SelectorQuery
  }

  namespace NodesRef {
    /** 回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。 */
    type BoundingClientRectCallback = (
      result: BoundingClientRectCallbackResult | BoundingClientRectCallbackResult[],
    ) => void
    interface BoundingClientRectCallbackResult {
      /** 节点的下边界坐标 */
      bottom: number
      /** 节点的 dataset */
      dataset: TaroGeneral.IAnyObject
      /** 节点的高度 */
      height: number
      /** 节点的 ID */
      id: string
      /** 节点的左边界坐标 */
      left: number
      /** 节点的右边界坐标 */
      right: number
      /** 节点的上边界坐标 */
      top: number
      /** 节点的宽度 */
      width: number
    }
    /** 回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。 */
    type ContextCallback = (result: ContextCallbackResult) => void
    interface ContextCallbackResult {
      /** 节点对应的 Context 对象 */
      context: TaroGeneral.IAnyObject
    }

    interface Fields {
      /** 指定样式名列表，返回节点对应样式名的当前值 */
      computedStyle?: string[]
      /** 是否返回节点对应的 Context 对象 */
      context?: boolean
      /** 是否返回节点 dataset */
      dataset?: boolean
      /** 是否返回节点 id */
      id?: boolean
      /** 是否返回节点 mark */
      mark?: boolean
      /** 是否返回节点对应的 Node 实例 */
      node?: boolean
      /** 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取） */
      properties?: string[]
      /** 是否返回节点布局位置（`left` `right` `top` `bottom`） */
      rect?: boolean
      /** 否 是否返回节点的 `scrollLeft` `scrollTop`，节点必须是 `scroll-view` 或者 `viewport` */
      scrollOffset?: boolean
      /** 是否返回节点尺寸（`width` `height`） */
      size?: boolean
    }
    /** 回调函数 */
    type FieldsCallback = (
      /** 节点的相关信息 */
      res: TaroGeneral.IAnyObject,
    ) => void
    /** 回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。 */
    type NodeCallback = (result: NodeCallbackResult) => void
    /** 回调函数 */
    interface NodeCallbackResult {
      /** 节点对应的 Node 实例 */
      node: TaroGeneral.IAnyObject
    }
    /** 回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。 */
    type ScrollOffsetCallback = (result: ScrollOffsetCallbackResult) => void
    interface ScrollOffsetCallbackResult {
      /** 节点的 dataset */
      dataset: TaroGeneral.IAnyObject
      /** 节点的 ID */
      id: string
      /** 节点的水平滚动位置 */
      scrollLeft: number
      /** 节点的竖直滚动位置 */
      scrollTop: number
    }
  }

  /** 查询节点信息的对象
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.html
   */
  interface SelectorQuery {
    /** 执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.exec.html
     */
    exec(
      /** 回调函数 */
      callback?: (...args: any[]) => any,
    ): NodesRef
    /** 将选择器的选取范围更改为自定义组件 `component` 内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点）。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Component({
     *   queryMultipleNodes () {
     *     const query = Taro.createSelectorQuery().in(this)
     *     query.select('#the-id').boundingClientRect(function(res){
     *       res.top // 这个组件内 #the-id 节点的上边界坐标
     *     }).exec()
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.in.html
     */
    in(
        /** 自定义组件实例 */
        component: TaroGeneral.IAnyObject,
    ): SelectorQuery
    /** 在当前页面下选择第一个匹配选择器 `selector` 的节点。返回一个 `NodesRef` 对象实例，可以用于获取节点信息。
     *
     * **selector 语法**
     *
     *
     * selector类似于 CSS 的选择器，但仅支持下列语法。
     *
     * - ID选择器：#the-id
     * - class选择器（可以连续指定多个）：.a-class.another-class
     * - 子元素选择器：.the-parent > .the-child
     * - 后代选择器：.the-ancestor .the-descendant
     * - 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
     * - 多选择器的并集：#a-node, .some-other-nodes
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().select('#the-id').fields({
     *   dataset: true,
     *   size: true,
     *   scrollOffset: true,
     *   properties: ['scrollX', 'scrollY']
     * }, function (res){
     *   res.dataset    // 节点的dataset
     *   res.width      // 节点的宽度
     *   res.height     // 节点的高度
     *   res.scrollLeft // 节点的水平滚动位置
     *   res.scrollTop  // 节点的竖直滚动位置
     *   res.scrollX    // 节点 scroll-x 属性的当前值
     *   res.scrollY    // 节点 scroll-x 属性的当前值
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.select.html
     */
    select(
      /** 选择器 */
      selector: string,
    ): NodesRef
    /** 在当前页面下选择匹配选择器 selector 的所有节点。
     *
     * **selector 语法**
     *
     * selector类似于 CSS 的选择器，但仅支持下列语法。
     *
     * - ID选择器：#the-id
     * - class选择器（可以连续指定多个）：.a-class.another-class
     * - 子元素选择器：.the-parent > .the-child
     * - 后代选择器：.the-ancestor .the-descendant
     * - 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
     * - 多选择器的并集：#a-node, .some-other-nodes
     * @supported weapp, h5, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.selectAll.html
     */
    selectAll(
      /** 选择器 */
      selector: string,
    ): NodesRef
    /** 选择显示区域。可用于获取显示区域的尺寸、滚动位置等信息。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.createSelectorQuery().selectViewport().scrollOffset(function (res) {
     *   res.id      // 节点的ID
     *   res.dataset // 节点的dataset
     *   res.scrollLeft // 节点的水平滚动位置
     *   res.scrollTop  // 节点的竖直滚动位置
     * }).exec()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.selectViewport.html
     */
    selectViewport(): NodesRef
  }

  interface TaroStatic {
    /** 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 `this.createSelectorQuery()` 来代替。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * const query = Taro.createSelectorQuery()
     * query.select('#the-id').boundingClientRect()
     * query.selectViewport().scrollOffset()
     * query.exec(function(res){
     *   res[0].top       // #the-id节点的上边界坐标
     *   res[1].scrollTop // 显示区域的竖直滚动位置
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html
     */
    createSelectorQuery(): SelectorQuery

    /** 创建并返回一个 IntersectionObserver 对象实例。在自定义组件或包含自定义组件的页面中，应使用 `this.createIntersectionObserver([options])` 来代替。
     * @supported weapp, h5, tt, harmony_hybrid
     * @example
     * ```tsx
     * const observer = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html
     */
    createIntersectionObserver(
      /** 自定义组件实例 */
      component: TaroGeneral.IAnyObject,
      /** 选项 */
      options?: createIntersectionObserver.Option,
    ): IntersectionObserver

    /** 创建并返回一个 MediaQueryObserver 对象实例。在自定义组件或包含自定义组件的页面中，应使用 `this.createMediaQueryObserver()` 来代替。
     * @supported h5, harmony_hybrid
     * @example
     * ```tsx
     * let createMediaQueryObserver
     * if (process.env.TARO_ENV === 'weapp') {
     *    // 小程序没有组件实例，只能获取Page级组件实例
     *    createMediaQueryObserver = Taro.getCurrentInstance().page.createMediaQueryObserver
     * } else if (process.env.TARO_ENV === 'h5') {
     *    createMediaQueryObserver= Taro.createMediaQueryObserver
     * }
     * const mediaQueryObserver = createMediaQueryObserver()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#Media%20Query
     */
    createMediaQueryObserver(): MediaQueryObserver
  }
}
