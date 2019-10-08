import { TaroNode } from './node'
import { TaroEventTarget } from './event_target'

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

  public nativeTarget: TaroEventTarget

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
