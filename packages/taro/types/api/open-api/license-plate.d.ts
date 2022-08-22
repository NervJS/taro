import Taro from '../../index'

declare module '../../index' {
  namespace chooseLicensePlate {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 用户选择的车牌号 */
      plateNumber: string
    }
  }

  interface TaroStatic {
    /** 选择车牌号
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/license-plate/wx.chooseLicensePlate.html
     */
    chooseLicensePlate(option?: chooseLicensePlate.Option): Promise<chooseLicensePlate.SuccessCallbackResult>
  }
}
