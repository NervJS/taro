import { TaroNode } from './node'
import { EMPTY_OBJ } from '@tarojs/shared'
import { document } from '../bom/document'
import { TaroElement } from './element'
import { CurrentReconciler } from '../reconciler'
import { isParentBinded } from '../utils'

interface EventOptions {
  bubbles: boolean;
  cancelable: boolean;
}

type Target = Record<string, unknown> & { dataset: Record<string, unknown>, id: string }

export const eventSource = new Map<string | undefined | null, TaroNode>()

export class TaroEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  // timestamp can either be hi-res ( relative to page load) or low-res (relative to UNIX epoch)
  // here use hi-res timestamp
  public timeStamp = Date.now()

  public mpEvent: MpEvent | undefined

  public constructor (type: string, opts: EventOptions, event?: MpEvent) {
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
    const element = document.getElementById(this.mpEvent?.target.id)
    return { ...this.mpEvent?.target, ...this.mpEvent?.detail, dataset: element !== null ? element.dataset : EMPTY_OBJ }
  }

  get currentTarget () {
    const element = document.getElementById(this.mpEvent?.currentTarget.id)

    if (element === null) {
      return this.target
    }

    return { ...this.mpEvent?.currentTarget, ...this.mpEvent?.detail, dataset: element.dataset }
  }
}

export interface MpEvent {
  type: string;
  detail: Record<string, unknown>
  target: Target
  currentTarget: Target
}

export function createEvent (event: MpEvent | string, _?: TaroElement) {
  if (typeof event === 'string') {
    return new TaroEvent(event, { bubbles: true, cancelable: true })
  }

  const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true }, event)
  for (const key in event) {
    if (key === 'currentTarget' || key === 'target' || key === 'type' || key === 'timeStamp') {
      continue
    } else {
      domEv[key] = event[key]
    }
  }

  return domEv
}

const eventsBatch = {}

export function eventHandler (event: MpEvent) {
  CurrentReconciler.modifyEventType?.(event)

  if (event.currentTarget == null) {
    event.currentTarget = event.target
  }

  const node = document.getElementById(event.currentTarget.id)
  if (node != null) {
    const dispatch = () => {
      node.dispatchEvent(createEvent(event, node))
    }
    if (typeof CurrentReconciler.batchedEventUpdates === 'function') {
      const type = event.type

      if (!isParentBinded(node, type) || (type === 'touchmove' && !!node.props.catchMove)) {
        // 最上层组件统一 batchUpdate
        CurrentReconciler.batchedEventUpdates(() => {
          if (eventsBatch[type]) {
            eventsBatch[type].forEach(fn => fn())
            delete eventsBatch[type]
          }
          dispatch()
        })
      } else {
        // 如果上层组件也有绑定同类型的组件，委托给上层组件调用事件回调
        (eventsBatch[type] ||= []).push(dispatch)
      }
    } else {
      dispatch()
    }
  }
}
