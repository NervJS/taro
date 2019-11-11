import { TaroNode } from './node'
import { isUndefined } from '@tarojs/shared'

interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

export const eventSource = new Map<string, TaroNode>()

export class TaroEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  public target: Record<string, unknown>

  public currentTarget: Record<string, unknown>

  public constructor (type: string, opts: EventOptions) {
    this.type = type.toLowerCase()
    this.bubbles = Boolean(opts && opts.bubbles)
    this.cancelable = Boolean(opts && opts.cancelable)
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

interface MpEvent {
  type: string;
  detail: Record<string, unknown>
}

export function createEvent (event: MpEvent) {
  const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true })
  for (const key in event) {
    if (key === 'currentTarget' || key === 'target') {
      domEv[key] = {
        ...event[key],
        ...event.detail
      }
    } else {
      domEv[key] = event[key]
    }
  }

  if (isUndefined(domEv.currentTarget)) {
    domEv.currentTarget = domEv.target
  }

  return domEv
}
