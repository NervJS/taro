import { isString } from '@tarojs/shared'

import { CONTEXT_ACTIONS } from '../constants'
import { Events } from '../emitter/emitter'
import env from '../env'
import { taroGetComputedStyleProvider } from './getComputedStyle'
import { History } from './history'
import { Location } from './location'
import { nav as navigator } from './navigator'
import { caf, raf } from './raf'

import type { TaroHistory } from './history'
import type { TaroLocation } from './location'

class TaroWindow extends Events {
  navigator = navigator
  requestAnimationFrame = raf
  cancelAnimationFrame = caf
  getComputedStyle = taroGetComputedStyleProvider
  Date: DateConstructor

  location: TaroLocation
  history: TaroHistory
  XMLHttpRequest?: Partial<XMLHttpRequest>

  constructor () {
    super()

    const globalProperties = [
      ...Object.getOwnPropertyNames(global || {}),
      ...Object.getOwnPropertySymbols(global || {})
    ]

    globalProperties.forEach(property => {
      if (property === 'atob' || property === 'document') return
      if (!Object.prototype.hasOwnProperty.call(this, property)) {
        // 防止小程序环境下，window 上的某些 get 属性在赋值时报错
        try {
          this[property] = global[property]
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[Taro warn] window.${String(property)} 在赋值到 window 时报错`)
          }
        }
      }
    })

    this.Date ||= Date

    // 应用启动时，提供给需要读取历史信息的库使用
    this.location = new Location({ window: this }) as any
    // @ts-ignore
    this.history = new History(this.location, { window: this })

    this.initEvent()
  }

  initEvent () {
    const _location = this.location
    const _history = this.history

    this.on(CONTEXT_ACTIONS.INIT, (pageId: string) => {
      // 页面onload，为该页面建立新的上下文信息
      _location.trigger(CONTEXT_ACTIONS.INIT, pageId)
    }, null)

    this.on(CONTEXT_ACTIONS.RECOVER, (pageId: string) => {
      // 页面onshow，恢复当前页面的上下文信息
      _location.trigger(CONTEXT_ACTIONS.RECOVER, pageId)
      _history.trigger(CONTEXT_ACTIONS.RECOVER, pageId)
    }, null)

    this.on(CONTEXT_ACTIONS.RESTORE, (pageId: string) => {
      // 页面onhide，缓存当前页面的上下文信息
      _location.trigger(CONTEXT_ACTIONS.RESTORE, pageId)
      _history.trigger(CONTEXT_ACTIONS.RESTORE, pageId)
    }, null)

    this.on(CONTEXT_ACTIONS.DESTORY, (pageId: string) => {
      // 页面onunload，清除当前页面的上下文信息
      _location.trigger(CONTEXT_ACTIONS.DESTORY, pageId)
      _history.trigger(CONTEXT_ACTIONS.DESTORY, pageId)
    }, null)
  }

  get document () {
    return env.document
  }

  addEventListener (event: string, callback: (arg: any) => void) {
    if (!isString(event)) return
    this.on(event, callback, null)
  }

  removeEventListener (event: string, callback: (arg: any) => void) {
    if (!isString(event)) return
    this.off(event, callback, null)
  }

  setTimeout (...args: Parameters<typeof setTimeout>) {
    return setTimeout(...args)
  }

  clearTimeout (...args: Parameters<typeof clearTimeout>) {
    return clearTimeout(...args)
  }
}

export type { TaroWindow }

// Note: 小程序端 vite 打包成 commonjs，const window = xxx 会报错，所以把 window 改为 taroWindowProvider，location 和 history 同理
export const taroWindowProvider: TaroWindow = process.env.TARO_PLATFORM === 'web' ? env.window : (env.window = new TaroWindow())
export const taroLocationProvider = taroWindowProvider.location
export const taroHistoryProvider = taroWindowProvider.history
