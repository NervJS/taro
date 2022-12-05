type TCallback<T = Partial<TaroGeneral.CallbackResult>> = (res: T) => Promise<void> | void
interface IMethodParam<T = Partial<TaroGeneral.CallbackResult>> {
  name: string
  success?: TCallback<T>
  fail?: TCallback
  complete?: TCallback
}

export class MethodHandler<T = Partial<TaroGeneral.CallbackResult>> {
  methodName: string

  protected __success?: TCallback<T>
  protected __fail?: TCallback
  protected __complete?: TCallback

  constructor ({ name, success, fail, complete }: IMethodParam<T>) {
    this.methodName = name
    this.__success = success
    this.__fail = fail
    this.__complete = complete
  }

  success<U = Record<string, unknown>> (res: Partial<T> & Partial<TaroGeneral.CallbackResult> = {}, resolve = Promise.resolve.bind(Promise)): Promise<T & U & TaroGeneral.CallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:ok`
    }
    typeof this.__success === 'function' && this.__success(res as T)
    typeof this.__complete === 'function' && this.__complete(res)
    return resolve(res as Required<T & U & TaroGeneral.CallbackResult>)
  }

  fail<U = Record<string, unknown>> (res: Partial<T> & Partial<TaroGeneral.CallbackResult> = {}, reject = Promise.reject.bind(Promise)): Promise<T & U & TaroGeneral.CallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:fail`
    } else {
      res.errMsg = `${this.methodName}:fail ${res.errMsg}`
    }
    console.error(res.errMsg)
    typeof this.__fail === 'function' && this.__fail(res)
    typeof this.__complete === 'function' && this.__complete(res)
    return reject(res)
  }

  cancel<U = Record<string, unknown>> (res: Partial<T> & Partial<TaroGeneral.CallbackResult> = {}, resolve = Promise.resolve.bind(Promise)): Promise<T & U & TaroGeneral.CallbackResult> {
    if (!res.errMsg) {
      res.errMsg = `${this.methodName}:fail`
    } else {
      res.errMsg = `${this.methodName}:fail ${res.errMsg}`
    }
    // 点击取消走fail回调
    typeof this.__fail === 'function' && this.__fail(res)
    typeof this.__complete === 'function' && this.__complete(res)
    // 使用resolve取消报错
    return resolve(res as Required<T & U & TaroGeneral.CallbackResult>)
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
      if (typeof opt === 'function') {
        opt(...args)
      } else {
        const { callback, ctx } = opt
        typeof callback === 'function' && callback.call(ctx, ...args)
      }
    })
  }
}
