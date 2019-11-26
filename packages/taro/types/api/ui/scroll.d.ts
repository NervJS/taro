declare namespace Taro {
  namespace pageScrollTo {
    type Param = {
      /**
       * 滚动到页面的目标位置（单位px）
       */
      scrollTop?: number
      /**
       * 滚动动画的时长，默认300ms，单位 ms
       */
      duration?: number
      /**
       * 选择器, css selector
       */
      selector?: string
    }
  }
  /**
   * 将页面滚动到目标位置。
   * @example
   * ```tsx
   * Taro.pageScrollTo({
   *   scrollTop: 0,
   *   duration: 300
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html
   */
  function pageScrollTo(res: pageScrollTo.Param): void
}
