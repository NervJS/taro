import Taro from '../../index'

declare module '../../index' {
  namespace setWindowSize {
    interface Option {
      /** 窗口宽度，以像素为单位 */
      width: string
      /** 窗口高度，以像素为单位 */
      height: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }
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
    /** 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.setWindowSize.html
     */
    setWindowSize(option: setWindowSize.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听窗口尺寸变化事件
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.onWindowResize.html
     */
    onWindowResize(
      /** 窗口尺寸变化事件的回调函数 */
      callback: onWindowResize.Callback,
    ): void

    /** 取消监听窗口尺寸变化事件
     * @supported weapp, h5, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.offWindowResize.html
     */
    offWindowResize(
      /** 窗口尺寸变化事件的回调函数 */
      callback: offWindowResize.Callback,
    ): void

    /**
     * 返回当前是否存在小窗播放（小窗在 video/live-player/live-pusher 下可用）
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/window/wx.checkIsPictureInPictureActive.html
     */
    checkIsPictureInPictureActive(): boolean
  }
}
