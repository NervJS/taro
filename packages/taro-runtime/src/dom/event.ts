import { TaroNode } from './node'
import { EMPTY_OBJ, hasOwn, toCamelCase } from '@tarojs/shared'
import { document } from '../bom/document'
import { TaroElement } from './element'

interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

type Target = Record<string, unknown> & { dataset: Record<string, unknown>, id: string }

export const eventSource = new Map<string, TaroNode>()

export function getDataset (element: TaroElement | null) {
  if (element === null || element.dataset === EMPTY_OBJ) {
    return EMPTY_OBJ
  }

  const dataset = {}

  for (const key in element.dataset) {
    if (hasOwn(dataset, key)) {
      dataset[toCamelCase(key)] = element.dataset[key]
    }
  }

  return dataset
}

export class TaroEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  public mpEvent: MpEvent

  public constructor (type: string, opts: EventOptions, event: MpEvent) {
    this.type = type.toLowerCase()
    this.mpEvent = event
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

  get target () {
    const element = document.getElementById(this.mpEvent.target.id)
    return { ...this.mpEvent.target, ...this.mpEvent.detail, dataset: getDataset(element) }
  }

  get currentTarget () {
    const element = document.getElementById(this.mpEvent.target.id)

    if (element === null) {
      return this.target
    }

    return { ...this.mpEvent.currentTarget, ...this.mpEvent.detail, dataset: getDataset(element) }
  }
}

export interface MpEvent {
  type: string;
  detail: Record<string, unknown>
  target: Target
  currentTarget: Target
}

export function createEvent (event: MpEvent, _?: TaroElement) {
  const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true }, event)
  for (const key in event) {
    if (key === 'currentTarget' || key === 'target' || key === 'type') {
      continue
    } else {
      domEv[key] = event[key]
    }
  }

  return domEv
}

export function eventHandler (event: MpEvent) {
  const node = document.getElementById(event.currentTarget.id)
  if (node != null) {
    node.dispatchEvent(createEvent(event, node))
  }
}
