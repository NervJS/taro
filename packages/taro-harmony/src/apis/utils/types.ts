import { General } from '@tarojs/taro/types'
export interface IAsyncParams {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: General.CallbackResult) => void
  /** 接口调用失败的回调函数 */
  fail?: (res: General.CallbackResult) => void
  /** 接口调用成功的回调函数 */
  success?: (res: General.CallbackResult) => void
}
