import Taro from '../../index'

declare module '../../index' {
  namespace sendSms {
    interface Option {
      /** 预填到发送短信面板的手机号 */
      phoneNumber?: string
      /** 预填到发送短信面板的内容 */
      content?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 拉起手机发送短信界面
     * @supported weapp, tt
     * @see declare module '../../index' 
     */
    sendSms(option: sendSms.Option): Promise<TaroGeneral.CallbackResul>
  }
}