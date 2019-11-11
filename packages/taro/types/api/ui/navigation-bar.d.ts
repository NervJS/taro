declare namespace Taro {
  /**
   * 在当前页面显示导航条加载动画。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.showNavigationBarLoading.html
   */
  function showNavigationBarLoading(): void

  namespace setNavigationBarTitle {
    type Param = {
      /**
       * 页面标题
       */
      title: string
    }
  }
  /**
   * 动态设置当前页面的标题。
   * @example
   * ```tsx
   * Taro.setNavigationBarTitle({
   *   title: '当前页面'
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarTitle.html
   */
  function setNavigationBarTitle(res: setNavigationBarTitle.Param): Promise<any>

  namespace setNavigationBarColor {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
       */
      frontColor: string
      /**
       * 背景颜色值，有效值为十六进制颜色
       */
      backgroundColor: string
      /**
       * 动画效果
       *
       * **animation.timingFunc 有效值：**
       *
       *   值          |  说明
       * --------------|-------------------
       *   linear      |动画从头到尾的速度是相同的。
       *   easeIn      |  动画以低速开始
       *   easeOut     |  动画以低速结束。
       *   easeInOut   |动画以低速开始和结束。
       */
      animation?: ParamPropAnimation
    }
    /**
     * 动画效果
     *
     * **animation.timingFunc 有效值：**
     *
     * 值          |  说明
     * --------------|-------------------
     * linear      |动画从头到尾的速度是相同的。
     * easeIn      |  动画以低速开始
     * easeOut     |  动画以低速结束。
     * easeInOut   |动画以低速开始和结束。
     */
    type ParamPropAnimation = {
      /**
       * 动画变化时间，默认0，单位：毫秒
       */
      duration?: number
      /**
       * 动画变化方式，默认 linear
       */
      timingFunc?: string
    }
  }
  /**
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
  function setNavigationBarColor(res: setNavigationBarColor.Param): Promise<setNavigationBarColor.Promised>

  /**
   * 隐藏导航条加载动画。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideNavigationBarLoading.html
   */
  function hideNavigationBarLoading(): void

  namespace hideHomeButton {
    type Param = {
      /** 
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: CompleteCallback
      /** 
       * 接口调用失败的回调函数
       */
      fail?: FailCallback
      /** 
       * 接口调用成功的回调函数
       */
      success?: SuccessCallback
    }

    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
    }

    type SuccessCallback = (res: Promised) => void
    type FailCallback = (res: Promised) => void
    type CompleteCallback = (res: Promised) => void
  }
  /**
   * 隐藏返回首页按钮。
   * 
   * **注意：** 微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，
   * 默认展示“返回首页”按钮，开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏。
   * 
   * @param option 隐藏返回首页按钮的参数
   * 
   * 
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideHomeButton.html
   */
  function hideHomeButton(option?: hideHomeButton.Param): Promise<hideHomeButton.Promised>
}
