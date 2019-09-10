import { MpNode } from './node'

interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

export const eventSource = new Map<string, MpNode>()

export class MpEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop: boolean = false

  public _end: boolean = false

  public defaultPrevented: boolean = false

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

function toLower (str) {
  return String(str).toLowerCase()
}

function splice (arr, item, add, byValue) {
  const i = arr ? findWhere(arr, item, true, byValue) : -1
  if (~i) add ? arr.splice(i, 0, add) : arr.splice(i, 1)
  return i
}

function findWhere (arr, fn, returnIndex, byValue) {
  let i = arr.length
  while (i--) if (byValue ? arr[i] === fn : fn(arr[i])) break
  return returnIndex ? i : arr[i]
}

export class MpEventTarget {
  public __handlers: Record<string, Function[]>

  public constructor () {
    this.__handlers = {}
  }

  public addEventListener (type, handler) {
    (this.__handlers[toLower(type)] || (this.__handlers[toLower(type)] = [])).push(handler)
  }

  public removeEventListener (type, handler) {
    splice(this.__handlers[toLower(type)], handler, false, true)
  }

  public dispatchEvent (event) {
    let target = event.target = this as any
    const cancelable = event.cancelable
    let listener
    let i
    do {
      event.currentTarget = target
      listener = target.__handlers && target.__handlers[toLower(event.type)]
      if (listener) {
        for (i = listener.length; i--;) {
          if ((listener[i].call(target, event) === false || event._end) && cancelable) {
            event.defaultPrevented = true
          }
        }
      }
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (event.bubbles && !(cancelable && event._stop) && (target = target.parentNode))
    return listener != null
  }
}
