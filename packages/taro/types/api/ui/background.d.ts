declare namespace Taro {
  namespace setBackgroundTextStyle {
    type Param = {
      /**
       * 下拉背景字体、loading 图的样式。
       */
      textStyle: 'dark' | 'light'
    }
  }
  /**
   * 动态设置下拉背景字体、loading 图的样式
   * @example
   ```tsx
   Taro.setBackgroundTextStyle({
     textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundTextStyle.html
   */
  function setBackgroundTextStyle(res: setBackgroundTextStyle.Param): Promise<any>

  namespace setBackgroundColor {
    type Param = {
      /**
       * 窗口的背景色，必须为十六进制颜色值
       */
      backgroundColor?: string
      /**
       * 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
       */
      backgroundColorTop?: string
      /**
       * 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
       */
      backgroundColorBottom?: string
    }
  }
  /**
   * 动态设置窗口的背景色
   * @example
   ```tsx
   Taro.setBackgroundColor({
     backgroundColor: '#ffffff', // 窗口的背景色为白色
     backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
     backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundColor.html
   */
  function setBackgroundColor(res: setBackgroundColor.Param): Promise<any>
}
