import Taro from '../../index'

declare module '../../index' {
  namespace checkIsOpenAccessibility {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** iOS 上开启辅助功能旁白，安卓开启 talkback 时返回 true */
      open: boolean
    }
  }

  interface TaroStatic {
    /** 检测是否开启视觉无障碍功能。
     * @supported weapp, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accessibility/wx.checkIsOpenAccessibility.html
     */
    checkIsOpenAccessibility(option: checkIsOpenAccessibility.Option): Promise<TaroGeneral.CallbackResult>
  }
}
