import Taro from '../../index'

declare module '../../index' {
  namespace showTabBarRedDot {
    interface Option {
      /** tabBar 的哪一项，从左边算起 */
      index: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace showTabBar {
    interface Option {
      /** 是否需要动画效果 */
      animation?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setTabBarStyle {
    interface Option {
      /** tab 的背景色，HexColor */
      backgroundColor?: string
      /** tabBar上边框的颜色， 仅支持 black/white */
      borderStyle?: string
      /** tab 上的文字默认颜色，HexColor */
      color?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** tab 上的文字选中时的颜色，HexColor */
      selectedColor?: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace setTabBarItem {
    interface Option {
      /** tabBar 的哪一项，从左边算起 */
      index: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效 */
      iconPath?: string
      /** 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效 */
      selectedIconPath?: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
      /** tab 上的按钮文字 */
      text?: string
    }
  }

  namespace setTabBarBadge {
    interface Option {
      /** tabBar 的哪一项，从左边算起 */
      index: number
      /** 显示的文本，超过 4 个字符则显示成 ... */
      text: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace removeTabBarBadge {
    interface Option {
      /** tabBar 的哪一项，从左边算起 */
      index: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace hideTabBarRedDot {
    interface Option {
      /** tabBar 的哪一项，从左边算起 */
      index: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace hideTabBar {
    interface Option {
      /** 是否需要动画效果 */
      animation?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 显示 tabBar 某一项的右上角的红点
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.showTabBarRedDot.html
     */
    showTabBarRedDot(option: showTabBarRedDot.Option): Promise<TaroGeneral.CallbackResult>

    /** 显示 tabBar
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.showTabBar.html
     */
    showTabBar(option?: showTabBar.Option): Promise<TaroGeneral.CallbackResult>

    /** 动态设置 tabBar 的整体样式
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.setTabBarStyle({
     *   color: '#FF0000',
     *   selectedColor: '#00FF00',
     *   backgroundColor: '#0000FF',
     *   borderStyle: 'white'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarStyle.html
     */
    setTabBarStyle(option?: setTabBarStyle.Option): Promise<TaroGeneral.CallbackResult>

    /** 动态设置 tabBar 某一项的内容，`2.7.0` 起图片支持临时文件和网络文件。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.setTabBarItem({
     *   index: 0,
     *   text: 'text',
     *   iconPath: '/path/to/iconPath',
     *   selectedIconPath: '/path/to/selectedIconPath'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarItem.html
     */
    setTabBarItem(option: setTabBarItem.Option): Promise<TaroGeneral.CallbackResult>

    /** 为 tabBar 某一项的右上角添加文本
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.setTabBarBadge({
     *   index: 0,
     *   text: '1'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html
     */
    setTabBarBadge(option: setTabBarBadge.Option): Promise<TaroGeneral.CallbackResult>

    /** 移除 tabBar 某一项右上角的文本
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.removeTabBarBadge.html
     */
    removeTabBarBadge(option: removeTabBarBadge.Option): Promise<TaroGeneral.CallbackResult>

    /** 隐藏 tabBar 某一项的右上角的红点
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.hideTabBarRedDot.html
     */
    hideTabBarRedDot(option: hideTabBarRedDot.Option): Promise<TaroGeneral.CallbackResult>

    /** 隐藏 tabBar
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.hideTabBar.html
     */
    hideTabBar(option?: hideTabBar.Option): Promise<TaroGeneral.CallbackResult>
  }
}
