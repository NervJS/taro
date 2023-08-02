import { hooks } from '@tarojs/shared'

import { CONFIRM, CURRENT_TARGET, INPUT, KEY_CODE, TARGET, TIME_STAMP, TYPE } from '../constant'
import { isParentBinded } from '../utils'
import { TaroElement } from './element'

import type { EventOptions } from '../interface'

// Taro 事件对象。以 Web 标准的事件对象为基础，加入小程序事件对象中携带的部分信息，并模拟实现事件冒泡。
export class TaroEvent {
  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  public target: TaroElement

  public currentTarget: TaroElement

  // Mouse Event botton property, it's used in 3rd lib, like react-router. default 0 in general
  public button = 0

  // timestamp can either be hi-res ( relative to page load) or low-res (relative to UNIX epoch)
  // here use hi-res timestamp
  public timeStamp = Date.now()

  public mpEvent: BaseEvent | undefined

  public constructor (type: string, opts: EventOptions, event?: BaseEvent) {
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


export function createEvent (event: BaseEvent | string, type?: string, node?: TaroElement) {
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
  const isStop = event._stop

  // eslint-disable-next-line no-unmodified-loop-condition
  while ((target = target.parentNode as TaroElement)) {
    event.currentTarget = target
    const listeners = target.__listeners[event.type]

    if (!Array.isArray(listeners)) {
      continue
    }

    for (let i = listeners.length; i--;) {
      const listener = listeners[i]

      if (!isStop) {
        // 由于冒泡也是模拟的，因此需要收集父节点事件，进行 batched 操作
        collectBatchFunction(target, event.type, listener.bind(node, event), event)
      }

      listener._stop = true
    }
  }
}

const eventsBatch = {}

function collectBatchFunction (node: TaroElement, type: string, dispatch: () => void, e: TaroEvent) {
  if (!hooks.isExist('batchedEventUpdates')) return

  if (
    !hooks.call('isBubbleEvents', type) || !isParentBinded(node, type)
  ) {
    // 最上层组件统一 batchUpdate
    hooks.call('batchedEventUpdates', () => {
      if (eventsBatch[type]) {
        eventsBatch[type].forEach(fn => fn())
        delete eventsBatch[type]
      }
      dispatch()
    })
  } else {
    // 如果上层组件也有绑定同类型的组件，委托给上层组件调用事件回调
    (eventsBatch[type] ||= []).push(dispatch)

    stopOrTriggerPropagation(e, node)
  }
}

export function eventHandler (event, type: string, node: TaroElement) {
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

    if (!e._stop) {
      e._stop = true
    }
    // hooks.call('dispatchTaroEventFinish', e, node)
  }

  if (isBatchUpdates) {
    collectBatchFunction(node, type, dispatch, e)
  } else {
    dispatch()
  }
}
