import { isArray, isObject, warn } from '@tarojs/shared'

interface EventListenerOptions {
  capture?: boolean;
}

interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
}

export interface EventHandler extends Function {
  _stop?: boolean;
}

export class TaroEventTarget {
  public __handlers: Record<string, EventHandler[]> = {}

  public addEventListener (type: string, handler: EventHandler, options?: boolean | AddEventListenerOptions) {
    warn(type === 'regionchange', 'map 组件的 regionchange 事件非常特殊，请使用 begin/end 事件替代。详情：https://github.com/NervJS/taro/issues/5766')
    type = type.toLowerCase()
    const handlers = this.__handlers[type]
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

    warn(isCapture, 'The event capture feature is unimplemented.')

    if (isArray(handlers)) {
      handlers.push(handler)
    } else {
      this.__handlers[type] = [handler]
    }
  }

  public removeEventListener (type: string, handler: EventHandler) {
    type = type.toLowerCase()
    if (handler == null) {
      return
    }

    const handlers = this.__handlers[type]
    if (!isArray(handlers)) {
      return
    }

    const index = handlers.indexOf(handler)

    warn(index === -1, `事件: '${type}' 没有注册在 DOM 中，因此不会被移除。`)

    handlers.splice(index, 1)
  }
}
