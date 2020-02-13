import { TaroNode } from './node'
import { isUndefined, EMPTY_OBJ } from '@tarojs/shared'
import { CommonEvent } from '@tarojs/components'
import { document } from '../bom/document'
import { TaroElement } from './element'

interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

type Target = Record<string, unknown> & { dataset: Record<string, unknown> }

export const eventSource = new Map<string, TaroNode>()

export class TaroEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  public target: Target

  public currentTarget: Target

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

export function createEvent (event: MpEvent, element: TaroElement) {
  const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true })
  for (const key in event) {
    if (key === 'currentTarget' || key === 'target') {
      domEv[key] = {
        ...event[key],
        ...event.detail
      }
    } else if (key === 'type') {
      continue
    } else {
      domEv[key] = event[key]
    }
  }

  if (isUndefined(domEv.currentTarget)) {
    domEv.currentTarget = domEv.target
  }

  if (element.dataset !== EMPTY_OBJ) {
    domEv.currentTarget.dataset = { ...element.dataset }
    domEv.target.dataset = { ...element.dataset }
  }

  return domEv
}

export function eventHandler (event: CommonEvent) {
  const node = document.getElementById(event.currentTarget.id)
  if (node != null) {
    node.dispatchEvent(createEvent(event, node))
  }
}
