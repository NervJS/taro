declare namespace Taro {
  namespace setBackgroundTextStyle {
    interface Option {
      /** 下拉背景字体、loading 图的样式。
       *
       * 可选值：
       * - 'dark': dark 样式;
       * - 'light': light 样式; */
      textStyle: 'dark' | 'light'
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 动态设置下拉背景字体、loading 图的样式
   * @supported weapp
   * @example
   * ```tsx
   * Taro.setBackgroundTextStyle({
   *   textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundTextStyle.html
   */
  function setBackgroundTextStyle(option: setBackgroundTextStyle.Option): Promise<General.CallbackResult>

  namespace setBackgroundColor {
    interface Option {
      /** 窗口的背景色，必须为十六进制颜色值 */
      backgroundColor?: string
      /** 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持 */
      backgroundColorBottom?: string
      /** 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持 */
      backgroundColorTop?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
  }

  /** 动态设置窗口的背景色
   * @supported weapp
   * @example
   * ```tsx
   * Taro.setBackgroundColor({
   *   backgroundColor: '#ffffff', // 窗口的背景色为白色
   * })
   * Taro.setBackgroundColor({
   *   backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
   *   backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundColor.html
   */
  function setBackgroundColor(option: setBackgroundColor.Option): Promise<General.CallbackResult>
}
