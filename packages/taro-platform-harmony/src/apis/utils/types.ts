type GeneralCallback = (res: any) => void

export type FunctionType = (...args: any) => any

export interface IAsyncParams<T extends FunctionType = GeneralCallback> {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: GeneralCallback
  /** 接口调用失败的回调函数 */
  fail?: GeneralCallback
  /** 接口调用成功的回调函数 */
  success?: T
}
