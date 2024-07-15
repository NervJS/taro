import { EMPTY_OBJ, hooks, isUndefined } from '@tarojs/shared'

import {
  CONFIRM,
  CURRENT_TARGET,
  EVENT_CALLBACK_RESULT,
  INPUT,
  KEY_CODE,
  TARGET,
  TIME_STAMP,
  TOUCHMOVE,
  TYPE
} from '../constants'
import env from '../env'
import { isParentBinded } from '../utils'

import type { EventOptions, MpEvent } from '../interface'
import type { TaroElement } from './element'

// Taro 事件对象。以 Web 标准的事件对象为基础，加入小程序事件对象中携带的部分信息，并模拟实现事件冒泡。
export class TaroEvent {
  private cacheTarget
  private cacheCurrentTarget

  public type: string

  public bubbles: boolean

  public cancelable: boolean

  public _stop = false

  public _end = false

  public defaultPrevented = false

  // Mouse Event botton property, it's used in 3rd lib, like react-router. default 0 in general
  public button = 0

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
    const cacheTarget = this.cacheTarget
    if (!cacheTarget) {
      const target = Object.create(this.mpEvent?.target || null)
      const currentEle = env.document.getElementById(target.dataset?.sid || target.id || null)
      // Note：优先判断冒泡场景alipay的targetDataset的sid, 不然冒泡场景target属性吐出不对，其余拿取当前绑定id
      const element = env.document.getElementById(target.targetDataset?.sid || target.dataset?.sid || target.id || null)

      target.dataset = {
        ...(currentEle !== null ? currentEle.dataset : EMPTY_OBJ),
        ...(element !== null ? element.dataset : EMPTY_OBJ)
      }

      for (const key in this.mpEvent?.detail) {
        target[key] = this.mpEvent!.detail[key]
      }

      this.cacheTarget = target

      return target
    } else {
      return cacheTarget
    }
  }

  get currentTarget () {
    const cacheCurrentTarget = this.cacheCurrentTarget
    if (!cacheCurrentTarget) {
      const doc = env.document

      const currentTarget = Object.create(this.mpEvent?.currentTarget || null)

      const element = doc.getElementById(currentTarget.dataset?.sid || currentTarget.id || null)
      const targetElement = doc.getElementById(this.mpEvent?.target?.dataset?.sid as string || this.mpEvent?.target?.id as string || null)

      if (element === null || (element && element === targetElement)) {
        this.cacheCurrentTarget = this.target
        return this.target
      }

      currentTarget.dataset = element.dataset

      for (const key in this.mpEvent?.detail) {
        currentTarget[key] = this.mpEvent!.detail[key]
      }

      this.cacheCurrentTarget = currentTarget

      return currentTarget
    } else {
      return cacheCurrentTarget
    }
  }
}

export function createEvent (event: MpEvent | string, node?: TaroElement) {
  if (typeof event === 'string') {
    // For Vue3 using document.createEvent
    return new TaroEvent(event, { bubbles: true, cancelable: true })
  }

  const domEv = new TaroEvent(event.type, { bubbles: true, cancelable: true }, event)

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

const eventsBatch = {}

function getEventCBResult (event: MpEvent) {
  const result = event[EVENT_CALLBACK_RESULT]
  if (!isUndefined(result)) {
    delete event[EVENT_CALLBACK_RESULT]
  }
  return result
}

// 小程序的事件代理回调函数
export function eventHandler (event: MpEvent) {
  // Note: ohos 上事件没有设置 type、detail 类型 setter 方法，且部分事件（例如 load 等）缺失 target 导致事件错误
  event.type === undefined && Object.defineProperty(event, 'type', {
    value: (event as any)._type // ohos only
  })
  event.detail === undefined && Object.defineProperty(event, 'detail', {
    value: (event as any)._detail || { ...event } // ohos only
  })
  event.currentTarget = event.currentTarget || event.target || { ...event }
  hooks.call('modifyMpEventImpl', event)

  const currentTarget = event.currentTarget
  const id = currentTarget.dataset?.sid as string /** sid */ || currentTarget.id /** uid */ || event.detail?.id as string || ''

  const node = env.document.getElementById(id)
  if (node) {
    const dispatch = () => {
      const e = createEvent(event, node)

      hooks.call('modifyTaroEvent', e, node)
      hooks.call('dispatchTaroEvent', e, node)
      hooks.call('dispatchTaroEventFinish', e, node)
    }
    if (hooks.isExist('batchedEventUpdates')) {
      const type = event.type

      if (
        !hooks.call('isBubbleEvents', type) ||
        !isParentBinded(node, type) ||
        (type === TOUCHMOVE && !!node.props.catchMove)
      ) {
        // 最上层组件统一 batchUpdate
        hooks.call('batchedEventUpdates', () => {
          if (eventsBatch[type]) {
            eventsBatch[type].forEach(fn => fn())
            delete eventsBatch[type]
          }
          dispatch()
        })
        return getEventCBResult(event)
      } else {
        // 如果上层组件也有绑定同类型的组件，委托给上层组件调用事件回调
        (eventsBatch[type] ||= []).push(dispatch)
      }
    } else {
      dispatch()
      return getEventCBResult(event)
    }
  }
}
