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
