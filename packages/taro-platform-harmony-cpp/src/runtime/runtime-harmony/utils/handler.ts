import { isFunction } from './is'

export class CallbackManager {
  callbacks: any = []

  /** 添加回调 */
  add = (opt?: any) => {
    if (opt) this.callbacks.push(opt)
  }

  /** 移除回调 */
  remove = (opt?: any) => {
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
  trigger = (...args) => {
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
