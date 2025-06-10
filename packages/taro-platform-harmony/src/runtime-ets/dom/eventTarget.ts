import { isArray } from '@tarojs/shared'

import { Events } from '../emitter/emitter'
import { TaroEvent } from './event'

import type { EventHandler } from '../interface'

interface IOptions {
  capture?: boolean
  once?: boolean
  passive?: boolean
}

type fn = (...args: any[]) => any

class TaroEventTarget extends Events {
  __listeners: Record<string, EventHandler[]> = {}

  public addEventListener (type: string, listener: fn, options?: IOptions) {
    const once = options?.once ?? false

    if (once) {
      const wrapper = () => {
        listener.apply(this, arguments)
        this.removeEventListener(type, wrapper)
      }
      this.addEventListener(type, wrapper)
    }

    const listeners = this.__listeners[type]
    if (Array.isArray(listeners)) {
      listeners.push(listener)
    } else {
      this.__listeners[type] = [listener]
    }
  }

  public removeEventListener (type: string, listener: fn) {
    const listeners = this.__listeners[type]
    if (listeners?.length) {
      this.__listeners[type] = listeners.filter(item => item !== listener)
    }
  }

  public dispatchEvent (event: TaroEvent) {
    // @ts-ignore
    event.currentTarget = this
    const cancelable = event.cancelable
    const listeners = this.__listeners[event.type]

    if (!Array.isArray(listeners)) {
      return false
    }

    for (let i = listeners.length; i--;) {
      const listener = listeners[i]
      let result: unknown
      if (listener._stop) {
        listener._stop = false
      } else {
        result = listener.call(this, event)
      }

      if ((result === false || event._end) && cancelable) {
        event.defaultPrevented = true
      }

      if (event._end && event._stop) {
        break
      }
    }

    if (event._stop) {
      this._stopPropagation(event)
    }

    return listeners != null
  }

  private _stopPropagation (event: TaroEvent) {
    let target = this
    // @ts-ignore
    while ((target = target.parentNode as this)) {
      const listeners = target.__listeners[event.type]

      if (!isArray(listeners)) {
        continue
      }

      for (let i = listeners.length; i--;) {
        const l = listeners[i]
        l._stop = true
      }
    }
  }
}

export { TaroEventTarget }
