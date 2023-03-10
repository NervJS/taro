/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { isFunction } from '@tarojs/shared'

type TCallback<T = Partial<TaroGeneral.CallbackResult>> = (res: T) => Promise<void> | void
interface IMethodParam<T = Partial<TaroGeneral.CallbackResult>> {
  name: string
  success?: TCallback<T & TaroGeneral.CallbackResult>
  fail?: TCallback
  complete?: TCallback
}
interface IMockPromise {
  resolve?: typeof Promise.resolve | TFunc
  reject?: typeof Promise.reject | TFunc
}

export class MethodHandler<T = Partial<TaroGeneral.CallbackResult>> {
  methodName: string

  protected __success?: TCallback<T>
  protected __fail?: TCallback
  protected __complete?: TCallback

  protected isHandlerError = false

  constructor ({ name, success, fail, complete }: IMethodParam<T>) {
    this.methodName = name
    this.__success = success
    this.__fail = fail
    this.__complete = complete

    this.isHandlerError = isFunction(this.__complete) || isFunction(this.__fail)
  }

  success<U = Record<string, unknown>> (res: Partial<T> & Partial<TaroGeneral.CallbackResult> = {}, promise: IMockPromise = {}): Promise<T & U & TaroGeneral.CallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:ok`
    }
    isFunction(this.__success) && this.__success(res as T)
    isFunction(this.__complete) && this.__complete(res)

    const { resolve = Promise.resolve.bind(Promise) } = promise
    return resolve(res as Required<T & U & TaroGeneral.CallbackResult>)
  }

  fail<U = Record<string, unknown>> (res: Partial<T> & Partial<TaroGeneral.CallbackResult> = {}, promise: IMockPromise = {}): Promise<T & U & TaroGeneral.CallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:fail`
    } else {
      res.errMsg = `${this.methodName}:fail ${res.errMsg}`
    }
    if (process.env.NODE_ENV !== 'production') {
      console.error(res.errMsg)
    }
    isFunction(this.__fail) && this.__fail(res)
    isFunction(this.__complete) && this.__complete(res)

    const {
      resolve = Promise.resolve.bind(Promise),
      reject = Promise.reject.bind(Promise)
    } = promise
    return this.isHandlerError
      ? resolve(res as Required<T & U & TaroGeneral.CallbackResult>)
      : reject(res)
  }
}

type TCallbackManagerParam = (...arr: unknown[]) => void
interface ICallbackManagerOption {
  callback?: TCallbackManagerParam
  ctx?: any
  [key: string]: unknown
}
type TCallbackManagerListItem = (TCallbackManagerParam | ICallbackManagerOption)
type TCallbackManagerList = TCallbackManagerListItem[]

export class CallbackManager {
  callbacks: TCallbackManagerList = []

  /**
   * 添加回调
   * @param {{ callback: function, ctx: any } | function} opt
   */
  add = (opt?: TCallbackManagerListItem) => {
    if (opt) this.callbacks.push(opt)
  }

  /**
   * 移除回调
   * @param {{ callback: function, ctx: any } | function} opt
   */
  remove = (opt?: TCallbackManagerListItem) => {
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

  /**
   * 获取回调函数数量
   * @return {number}
   */
  count = () => {
    return this.callbacks.length
  }

  /**
   * 触发回调
   * @param  {...any} args 回调的调用参数
   */
  trigger = (...args: TCallbackManagerList) => {
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
