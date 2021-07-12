import { inject, injectable } from 'inversify'
import { isArray, isObject, warn } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'

import type { EventHandler, AddEventListenerOptions, IHooks } from '../interface'

@injectable()
export class TaroEventTarget {
  public __handlers: Record<string, EventHandler[]> = {}
  public hooks: IHooks

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: IHooks
  ) {
    this.hooks = hooks
  }

  public addEventListener (type: string, handler: EventHandler, options?: boolean | AddEventListenerOptions) {
    this.hooks.onAddEvent?.(type, handler, options, this)
    if (type === 'regionchange') {
      // map 组件的 regionchange 事件非常特殊，详情：https://github.com/NervJS/taro/issues/5766
      this.addEventListener('begin', handler, options)
      this.addEventListener('end', handler, options)
      return
    }
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

    process.env.NODE_ENV !== 'production' && warn(isCapture, 'Taro 暂未实现 event 的 capture 特性。')

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

    process.env.NODE_ENV !== 'production' && warn(index === -1, `事件: '${type}' 没有注册在 DOM 中，因此不会被移除。`)

    handlers.splice(index, 1)
  }

  public isAnyEventBinded (): boolean {
    const handlers = this.__handlers
    const isAnyEventBinded = Object.keys(handlers).find(key => handlers[key].length)
    return Boolean(isAnyEventBinded)
  }
}
