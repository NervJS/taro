declare namespace Taro {
  namespace onWindowResize {
    /** 窗口尺寸变化事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      size: Size
    }

    interface Size {
      /** 变化后的窗口高度，单位 px */
      windowHeight: number
      /** 变化后的窗口宽度，单位 px */
      windowWidth: number
    }
  }
  /** 监听窗口尺寸变化事件
   * @supported weapp, h5
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html
   */
  function onWindowResize(
    /** 窗口尺寸变化事件的回调函数 */
    callback: onWindowResize.Callback,
  ): void

  namespace offWindowResize {
    /** 窗口尺寸变化事件的回调函数 */
    type Callback = (res: General.CallbackResult) => void
  }
  /** 取消监听窗口尺寸变化事件
   * @supported weapp, h5
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html
   */
  function offWindowResize(
    /** 窗口尺寸变化事件的回调函数 */
    callback: offWindowResize.Callback,
  ): void
}
