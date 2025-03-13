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

// const eventsBatch = {}
// const BUBBLE_EVENTS = new Set([
//   // 'touchstart', // Note: CAPI 目前没有事件捕获，暂时禁用
//   // 'touchmove', // Note: CAPI 目前没有事件捕获，暂时禁用
//   // 'touchend', // Note: CAPI 目前没有事件捕获，暂时禁用
//   // 'touchcancel', // Note: CAPI 目前没有事件捕获，暂时禁用
//   // Note: 鸿蒙当前不支持以下事件冒泡
//   'click',
//   'longtap',
//   'change',
//   'submit',
//   'submit-btn',
//   'reset-btn'
// ])

export function eventHandler (event, _type: string, node: TaroElement): void {
  if (!node) return

  hooks.call('dispatchTaroEvent', event, node)
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
