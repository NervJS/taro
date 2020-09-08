const ONCE_LISTENER = Symbol('events.once')

type Listener = (...args: any[]) => void

type EventMap = {
  [K in keyof string | symbol]: Listener | Listener[]
}

export class Events {
  private events: EventMap = Object.create(null)

  on (eventName: string | symbol, listener: Listener): this {
    const existing = this.events[eventName]

    if (existing == null) {
      this.events[eventName] = listener
    } else {
      if (typeof existing === 'function') {
        this.events[eventName] = [existing, listener]
      } else {
        existing.push(listener)
      }
    }

    return this
  }

  once (eventName: string | symbol, listener: Listener): this {
    const wrapper = (...args) => {
      listener(...args)
      this.off(eventName, wrapper)
    }
    wrapper[ONCE_LISTENER] = listener

    this.on(eventName, wrapper)

    return this
  }

  off (eventName?: string | symbol, listener?: Listener): this {
    if (!eventName) {
      this.events = Object.create(null)
      return this
    }

    const existing = this.events[eventName]

    if (!listener) {
      if (existing) {
        delete this.events[eventName]
      }
      return this
    }

    if (existing === listener || existing[ONCE_LISTENER] === listener) {
      delete this.events[eventName]
    } else if (typeof existing !== 'function') {
      this.events[eventName] = existing.filter(x => x !== listener)

      if (this.events[eventName].length === 1) {
        this.events[eventName] = this.events[eventName][0]
      }
    }

    return this
  }

  trigger (eventName: string | symbol, ...args: any[]): boolean {
    const existing = this.events[eventName]
    if (existing == null) {
      return false
    }

    if (typeof existing === 'function') {
      existing(...args)
    } else {
      existing.slice().forEach(listener => {
        listener(...args)
      })
    }

    return true
  }
}

declare let my: any

export let eventCenter: Events

if (process.env.TARO_ENV === 'alipay') {
  if (!my.taroEventCenter) {
    my.taroEventCenter = new Events()
  }
  eventCenter = my.taroEventCenter
} else {
  eventCenter = new Events()
}
