import Taro from '../../index'

declare module '../../index' {
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

  namespace offWindowResize {
    /** 窗口尺寸变化事件的回调函数 */
    type Callback = (res: TaroGeneral.CallbackResult) => void
  }

  interface TaroStatic {
    /** 监听窗口尺寸变化事件
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html
     */
    onWindowResize(
      /** 窗口尺寸变化事件的回调函数 */
      callback: onWindowResize.Callback,
    ): void

    /** 取消监听窗口尺寸变化事件
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html
     */
    offWindowResize(
      /** 窗口尺寸变化事件的回调函数 */
      callback: offWindowResize.Callback,
    ): void
  }
}
