import { isFunction } from '@tarojs/shared'

import type { TFunc } from '@tarojs/runtime'

export interface ICallbackResult {
  /** 错误信息 */
  errMsg: string
}

type TCallback<T = Partial<ICallbackResult>> = (res: T) => Promise<void> | void
interface IMethodParam<T = Partial<ICallbackResult>> {
  name: string
  success?: TCallback<T & ICallbackResult>
  fail?: TCallback
  complete?: TCallback<T | ICallbackResult>
}
interface IMockPromise {
  resolve?: typeof Promise.resolve | TFunc
  reject?: typeof Promise.reject | TFunc
}

export class MethodHandler<T = Partial<ICallbackResult>> {
  methodName: string

  protected __success?: TCallback<T>
  protected __fail?: TCallback
  protected __complete?: TCallback<T | ICallbackResult>

  protected isHandlerError = false

  constructor ({ name, success, fail, complete }: IMethodParam<T>) {
    this.methodName = name
    this.__success = success
    this.__fail = fail
    this.__complete = complete

    this.isHandlerError = isFunction(this.__complete) || isFunction(this.__fail)
  }

  success<U = Record<string, unknown>> (res: Partial<T> & Partial<ICallbackResult> = {}, promise: IMockPromise = {}): Promise<T & U & ICallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:ok`
    }
    isFunction(this.__success) && this.__success(res as T)
    isFunction(this.__complete) && this.__complete(res as T)

    const { resolve = Promise.resolve.bind(Promise) } = promise
    return resolve(res as Required<T & U & ICallbackResult>)
  }

  fail<U = Record<string, unknown>> (res: Partial<T> & Partial<ICallbackResult> = {}, promise: IMockPromise = {}): Promise<T & U & ICallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:fail`
    } else {
      res.errMsg = `${this.methodName}:fail ${res.errMsg}`
    }
    isFunction(this.__fail) && this.__fail(res)
    isFunction(this.__complete) && this.__complete(res as ICallbackResult)

    const {
      resolve = Promise.resolve.bind(Promise),
      reject = Promise.reject.bind(Promise)
    } = promise
    return this.isHandlerError
      ? resolve(res as Required<T & U & ICallbackResult>)
      : reject(res)
  }
}

type TCallbackManagerFunc<T extends unknown[] = unknown[]> = (...arr: T) => void
interface ICallbackManagerOption<T extends unknown[] = unknown[]> {
  callback?: TCallbackManagerFunc<T>
  ctx?: any
  [key: string]: unknown
}
type TCallbackManagerUnit<T extends unknown[] = unknown[]> = (TCallbackManagerFunc<T> | ICallbackManagerOption<T>)

export class CallbackManager<T extends unknown[] = unknown[]> {
  callbacks: TCallbackManagerUnit<T>[] = []

  /** 添加回调 */
  add = (opt?: TCallbackManagerUnit<T>) => {
    if (opt) this.callbacks.push(opt)
  }

  /** 移除回调 */
  remove = (opt?: TCallbackManagerUnit<T>) => {
    if (opt) {
      let pos = -1
      this.callbacks.forEach((callback, k) => {
        if (callback === opt) {
          pos = k
        }
      })
      if (pos > -1) {
        this.callbacks.splice(pos, 1)
      }
    }
  }

  /** 获取回调函数数量 */
  count = () => {
    return this.callbacks.length
  }

  /** 触发回调 */
  trigger = (...args: T) => {
    this.callbacks.forEach(opt => {
      if (isFunction(opt)) {
        opt(...args)
      } else {
        const { callback, ctx } = opt
        isFunction(callback) && callback.call(ctx, ...args)
      }
    })
  }
}
