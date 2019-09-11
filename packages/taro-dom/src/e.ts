import { TaroNode } from './node'
import { isArray } from './utils/is'

interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

export const eventSource = new Map<string, TaroNode>()

export class TaroEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop: boolean = false

  public _end: boolean = false

  public defaultPrevented: boolean = false

  public nativeTarget: TaroEventTarget

  public constructor (type: string, opts: EventOptions) {
    this.type = type
    this.bubbles = !!(opts && opts.bubbles)
    this.cancelable = !!(opts && opts.cancelable)
  }

  public stopPropagation () {
    this._stop = true
  }

  public stopImmediatePropagation () {
    this._end = this._stop = true
  }

  public preventDefault () {
    this.defaultPrevented = true
  }
}

export class TaroEventTarget {
  protected __handlers: Record<string, Function[]> = {}

  public addEventListener (type: string, handler: Function) {
    const handlers = this.__handlers[type]
    if (isArray(handlers)) {
      handlers.push(handler)
    } else {
      this.__handlers[type] = [handler]
    }
  }

  public removeEventListener (type: string, handler: Function) {
    if (handler == null) {
      return
    }

    const handlers = this.__handlers[type]
    if (!isArray(handlers)) {
      return
    }

    const index = this.findIndex(handlers, handler)
    handlers.splice(index, 1)
  }

  protected findIndex<T> (childeNodes: T[], refChild: T | null) {
    const index = childeNodes.indexOf(refChild)
    if (index === -1) {
      throw new Error('refChild 不属于') // 改进报错
    }

    return index
  }

  /**
   *
   * dispatchEvent 只有在目前条件下 Element 才有，所以直接放到那去
   */
  // public dispatchEvent (event: TaroEvent): boolean
}

interface MpEvent {
  type: string;
}

export function createEvent (event: MpEvent) {
  const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true })
  for (const key in event) {
    if (key === 'currentTarget') {
      continue
    }

    domEv[key] = event[key]
  }

  return domEv
}
