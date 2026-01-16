import { hooks } from '@tarojs/shared'

import { CONFIRM, CURRENT_TARGET, INPUT, KEY_CODE, TARGET, TIME_STAMP, TYPE } from '../constant'
import { TaroElement } from './element/element'

import type { EventOptions } from '../interface'

// Taro 事件对象。以 Web 标准的事件对象为基础，加入小程序事件对象中携带的部分信息，并模拟实现事件冒泡。
export class TaroEvent<T = any> {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  public target: TaroElement

  public currentTarget: TaroElement

  /** 额外的信息 */
  public detail: T

  // Mouse Event botton property, it's used in 3rd lib, like react-router. default 0 in general
  public button = 0

  // timestamp can either be hi-res ( relative to page load) or low-res (relative to UNIX epoch)
  // here use hi-res timestamp
  public timeStamp = Date.now()

  public mpEvent: TaroEvent | undefined

  public constructor (type: string, opts: EventOptions, event?: TaroEvent) {
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
}

export function createEvent (event: TaroEvent | string, type?: string, node?: TaroElement) {
  if (typeof event === 'string') {
    // For Vue3 using document.createEvent
    return new TaroEvent(event, { bubbles: true, cancelable: true })
  }

  if (!type) return

  const domEv = new TaroEvent(type, { bubbles: true, cancelable: true }, event)

  for (const key in event) {
    if (key === CURRENT_TARGET || key === TARGET || key === TYPE || key === TIME_STAMP) {
      continue
    } else {
      domEv[key] = event[key]
    }
  }

  if (domEv.type === CONFIRM && node?.nodeName === INPUT) {
    // eslint-disable-next-line dot-notation
    domEv[KEY_CODE] = 13
  }

  return domEv
}

function stopOrTriggerPropagation (event: TaroEvent, node: TaroElement) {
  let target = node

  // eslint-disable-next-line no-unmodified-loop-condition
  while ((target = target.parentNode as TaroElement)) {
    const listeners = target.__listeners[event.type]

    if (!Array.isArray(listeners) || target._attrs?.disabled) {
      continue
    }

    const _target = target
    collectBatchFunction(event.type, () => {
      hooks.call('dispatchTaroEvent', event, _target)
    })
  }
}

const eventsBatch = {}
const BUBBLE_EVENTS = new Set([
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',
  'click',
  'longTap',
  'change',
  'submit',
  'submit-btn',
  'reset-btn'
])

function collectBatchFunction (type: string, dispatch: () => void) {
  if (hooks.isExist('batchedEventUpdates')) {
    (eventsBatch[type] ||= []).push(dispatch)
  } else {
    dispatch()
  }
}

export function eventHandler (event, type: string, node: TaroElement): void {
  if (!node) return

  const isBatchUpdates = hooks.isExist('batchedEventUpdates')
  const e = createEvent(event, type, node)

  if (!e) return

  const dispatch = () => {
    e.target = e.currentTarget = node

    // hooks.call('modifyTaroEvent', e, node)
    hooks.call('dispatchTaroEvent', e, node)

    // BatchUpdates 时冒泡环节需要提前，因为需要收集父节点事件
    if (!isBatchUpdates) {
      stopOrTriggerPropagation(e, node)
    }

    // hooks.call('dispatchTaroEventFinish', e, node)
  }

  dispatch()
  if (isBatchUpdates) {
    // collectBatchFunction(type, dispatch)

    // 如果需要触发冒泡，则执行 stopOrTriggerPropagation
    if (BUBBLE_EVENTS.has(type)) {
      stopOrTriggerPropagation(e, node)
    }

    hooks.call('batchedEventUpdates', () => {
      if (eventsBatch[type]) {
        eventsBatch[type].forEach(fn => fn())
        delete eventsBatch[type]
      }
    })
  }
}

export function createTaroEvent(type: string, opts: Partial<EventOptions> = {}, node?: TaroElement) {
  opts.bubbles ||= true
  opts.cancelable ||= true
  const e = new TaroEvent(type, opts as Required<EventOptions>)

  if (node) {
    const properties: Record<string, PropertyDescriptor> = {}
    properties.target = properties.currentTarget = {
      get() {
        return node
      }
    }
    Object.defineProperties(e, properties)
  }
  for (const key in opts) {
    if (['bubbles', 'cancelable'].includes(key)) {
      continue
    }
    e[key] = opts[key]
  }
  return e
}
