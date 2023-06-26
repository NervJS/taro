import Taro from '../../index'

declare module '../../index' {
  namespace checkIsAddedToMyMiniProgram {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }

    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /**是否被添加至 「我的小程序」 */
      added: boolean
    }
  }

  interface TaroStatic {
    /**
     * 检查小程序是否被添加至 「我的小程序」
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/my-miniprogram/wx.checkIsAddedToMyMiniProgram.html
     */
    checkIsAddedToMyMiniProgram(option?: checkIsAddedToMyMiniProgram.Option):Promise<checkIsAddedToMyMiniProgram.SuccessCallbackResult>
  }
}
