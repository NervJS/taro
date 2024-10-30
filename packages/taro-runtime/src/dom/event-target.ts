import { hooks, isArray, isObject, warn } from '@tarojs/shared'

import type { AddEventListenerOptions, EventHandler } from '../interface'

export class TaroEventTarget {
  public __handlers: Record<string, EventHandler[]> = {}

  public addEventListener (type: string, handler: EventHandler, options?: boolean | AddEventListenerOptions) {
    type = type.toLowerCase()

    hooks.call('onAddEvent', type, handler, options, this)

    if (type === 'regionchange') {
      // map 组件的 regionchange 事件非常特殊，详情：https://github.com/NervJS/taro/issues/5766
      this.addEventListener('begin', handler, options)
      this.addEventListener('end', handler, options)
      return
    }

    let isCapture = Boolean(options)
    let isOnce = false
    if (isObject<AddEventListenerOptions>(options)) {
      isCapture = Boolean(options.capture)
      isOnce = Boolean(options.once)
    }

    if (isOnce) {
      const wrapper = function () {
        handler.apply(this, arguments) // this 指向 Element
        this.removeEventListener(type, wrapper)
      }
      this.addEventListener(type, wrapper, {
        ...(options as AddEventListenerOptions),
        once: false
      })
      return
    }

    process.env.NODE_ENV !== 'production' && warn(isCapture, 'Taro 暂未实现 event 的 capture 特性。')

    // 某些框架，如 PReact 有委托的机制，handler 始终是同一个函数
    // 这会导致多层停止冒泡失败：view -> view(handler.stop = false) -> view(handler.stop = true)
    // 这样解决：view -> view(handlerA.stop = false) -> view(handlerB.stop = false)
    // 因此每次绑定事件都新建一个函数，如果带来了性能问题，可以把这段逻辑抽取到 PReact 插件中。
    const oldHandler = handler
    handler = function () {
      return oldHandler.apply(this, arguments) // this 指向 Element
    }
    ;(handler as any).oldHandler = oldHandler

    const handlers = this.__handlers[type]
    if (isArray(handlers)) {
      handlers.push(handler)
    } else {
      this.__handlers[type] = [handler]
    }
  }

  public removeEventListener (type: string, handler: EventHandler) {
    type = type.toLowerCase()

    if (type === 'regionchange') {
      // map 组件的 regionchange 事件非常特殊，详情：https://github.com/NervJS/taro/issues/5766
      this.removeEventListener('begin', handler)
      this.removeEventListener('end', handler)
      return
    }

    if (!handler) {
      return
    }

    const handlers = this.__handlers[type]
    if (!isArray(handlers)) {
      return
    }

    const index = handlers.findIndex(item => {
      if (item === handler || (item as any).oldHandler === handler) return true
    })

    process.env.NODE_ENV !== 'production' && warn(index === -1, `事件: '${type}' 没有注册在 DOM 中，因此不会被移除。`)

    handlers.splice(index, 1)
  }

  public isAnyEventBinded (): boolean {
    const handlers = this.__handlers
    const isAnyEventBinded = Object.keys(handlers).find(key => handlers[key].length)
    return Boolean(isAnyEventBinded)
  }

  public isOnlyClickBinded (): boolean {
    const handlers = this.__handlers
    const isOnlyClickBinded = handlers.tap && Object.keys(handlers).length === 1
    return Boolean(isOnlyClickBinded)
  }
}
