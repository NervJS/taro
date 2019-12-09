declare namespace Taro {
  namespace showNavigationBarLoading {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 在当前页面显示导航条加载动画
   * @supported weapp, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.showNavigationBarLoading.html
   */
  function showNavigationBarLoading(option?: showNavigationBarLoading.Option): void

  namespace setNavigationBarTitle {
    interface Option {
      /** 页面标题 */
      title: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 动态设置当前页面的标题
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.setNavigationBarTitle({
   *   title: '当前页面'
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarTitle.html
   */
  function setNavigationBarTitle(option: setNavigationBarTitle.Option): Promise<General.CallbackResult>

  namespace setNavigationBarColor {
    interface Option {
      /** 背景颜色值，有效值为十六进制颜色 */
      backgroundColor: string
      /** 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 */
      frontColor: string
      /** 动画效果 */
      animation?: AnimationOption
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    /** 动画效果 */
    interface AnimationOption {
      /** 动画变化时间，单位 ms */
      duration?: number
      /** 动画变化方式
       *
       * 可选值：
       * - 'linear': 动画从头到尾的速度是相同的;
       * - 'easeIn': 动画以低速开始;
       * - 'easeOut': 动画以低速结束;
       * - 'easeInOut': 动画以低速开始和结束; */
      timingFunc?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
    }
  }

  /** 设置页面导航条颜色
   * @supported weapp, h5, rn
   * @rn 不支持 animation 参数
   * @example
   * ```tsx
   * Taro.setNavigationBarColor({
   *     frontColor: '#ffffff',
   *     backgroundColor: '#ff0000',
   *     animation: {
   *         duration: 400,
   *         timingFunc: 'easeIn'
   *     }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarColor.html
   */
  function setNavigationBarColor(option: setNavigationBarColor.Option): Promise<General.CallbackResult>

  namespace hideNavigationBarLoading {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 在当前页面隐藏导航条加载动画
   * @supported weapp, rn
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideNavigationBarLoading.html
   */
  function hideNavigationBarLoading(option?: hideNavigationBarLoading.Option): void

  namespace hideHomeButton {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 隐藏返回首页按钮。微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮，开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideHomeButton.html
   */
  function hideHomeButton(option?: hideHomeButton.Option): Promise<General.CallbackResult>
}
