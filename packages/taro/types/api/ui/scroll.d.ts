import Taro from '../../index'

declare module '../../index' {
  namespace pageScrollTo {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 滚动动画的时长，单位 ms */
      duration?: number
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 滚动到页面的目标位置，单位 px */
      scrollTop?: number
      /** 选择器, css selector */
      selector?: string
      /** 偏移距离，需要和 selector 参数搭配使用，可以滚动到 selector 加偏移距离的位置，单位 px */
      offsetTop?: number
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  /** 增强 ScrollView 实例，可通过 [Taro.createSelectorQuery](/docs/apis/wxml/createSelectorQuery) 的 [NodesRef.node](/docs/apis/wxml/NodesRef#node) 方法获取。 仅在 `scroll-view` 组件开启 `enhanced` 属性后生效。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.createSelectorQuery()
   *   .select('#scrollview')
   *   .node()
   *   .exec((res) => {
   *     const scrollView = res[0].node;
   *     scrollView.scrollEnabled = false;
   *   })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.html
   */
  interface ScrollViewContext {
    /** 滚动开关 */
    scrollEnabled: boolean

    /** 设置滚动边界弹性 (仅在 iOS 下生效) */
    bounces: boolean

    /** 设置是否显示滚动条 */
    showScrollbar: boolean

    /** 分页滑动开关 */
    pagingEnabled: boolean

    /** 设置滚动减速速率 */
    fastDeceleration: boolean

    /** 取消滚动惯性 (仅在 iOS 下生效) */
    decelerationDisabled: boolean

    /** 滚动至指定位置
     * @supported weapp, h5
     * @h5 不支持 velocity 参数
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.scrollTo.html
     */
    scrollTo(object: ScrollViewContext.scrollTo.Option): void

    /** 滚动至指定位置
     * @supported weapp, tt, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.scrollIntoView.html
     */
    scrollIntoView(
      /** 元素选择器 */
      selector: string
    ): void
  }

  namespace ScrollViewContext {
    namespace scrollTo {
      interface Option {
        /** 顶部距离 */
        top?: number
        /** 左边界距离 */
        left?: number
        /** 初始速度 */
        velocity?: number
        /** 滚动动画时长 */
        duration?: number
        /** 是否启用滚动动画 */
        animated?: boolean
      }
    }
  }

  interface TaroStatic {
    /** 将页面滚动到目标位置，支持选择器和滚动距离两种方式定位
     *
     * **selector 语法**
     * selector类似于 CSS 的选择器，但仅支持下列语法。
     *
     *  - ID选择器：#the-id
     *  - class选择器（可以连续指定多个）：.a-class.another-class
     *  - 子元素选择器：.the-parent > .the-child
     *  - 后代选择器：.the-ancestor .the-descendant
     *  - 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
     *  - 多选择器的并集：#a-node, .some-other-nodes
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.pageScrollTo({
     *   scrollTop: 0,
     *   duration: 300
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html
     */
    pageScrollTo(option: pageScrollTo.Option): Promise<TaroGeneral.CallbackResult>
  }
}
