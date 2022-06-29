import { EMPTY_OBJ, isFunction } from '@tarojs/shared'
import { isParentBinded } from '../utils'
import { getDocument, getHooks } from '../container/store'
import {
  CONFIRM,
  CURRENT_TARGET,
  INPUT,
  KEY_CODE,
  TARGET,
  TIME_STAMP,
  TYPE,
  TOUCHMOVE
} from '../constants'

import type { TaroElement } from './element'
import type { EventOptions, MpEvent } from '../interface'

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

      const element = getDocument().getElementById(target.id)
      target.dataset = element !== null ? element.dataset : EMPTY_OBJ

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
      const doc = getDocument()

      const currentTarget = Object.create(this.mpEvent?.currentTarget || null)

      const element = doc.getElementById(currentTarget.id)
      const targetElement = doc.getElementById(this.mpEvent?.target?.id || null)

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

// 小程序的事件代理回调函数
export function eventHandler (event: MpEvent) {
  const hooks = getHooks()

  hooks.modifyMpEvent?.(event)

  event.currentTarget ||= event.target

  const currentTarget = event.currentTarget
  const id = currentTarget.dataset?.sid as string /** sid */ || currentTarget.id /** uid */ || ''

  const node = getDocument().getElementById(id)
  if (node) {
    const dispatch = () => {
      const e = createEvent(event, node)
      hooks.modifyTaroEvent?.(e, node)
      node.dispatchEvent(e)
    }
    if (isFunction(hooks.batchedEventUpdates)) {
      const type = event.type

      if (
        !hooks.isBubbleEvents(type) ||
        !isParentBinded(node, type) ||
        (type === TOUCHMOVE && !!node.props.catchMove)
      ) {
        // 最上层组件统一 batchUpdate
        hooks.batchedEventUpdates(() => {
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
