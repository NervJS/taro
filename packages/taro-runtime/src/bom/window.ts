import { isString } from '@tarojs/shared'
import { navigator } from './navigator'
import { document } from './document'
import { win } from '../env'
import { raf, caf } from './raf'
import { History } from './history'
import { Location } from './location'
import { getComputedStyle } from './getComputedStyle'
import { DATE } from '../constants'
import { CONTEXT_ACTIONS } from '../constants/events'
import { Events } from '../emitter/emitter'

let WindowConstructor
if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
  class Window extends Events {
    document: typeof document
    navigator: typeof navigator
    requestAnimationFrame: any
    cancelAnimationFrame: any
    getComputedStyle: any

    location: Location
    history: History

    constructor () {
      super()

      const globalProperties = [
        ...Object.getOwnPropertyNames(global || win),
        ...Object.getOwnPropertySymbols(global || win)
      ]

      globalProperties.forEach(property => {
        if (property === 'atob') return
        if (!Object.prototype.hasOwnProperty.call(this, property)) {
          this[property] = global[property]
        }
      })

      if (!(DATE in this)) {
        (this as any).Date = Date
      }

      this.document = document
      this.document.defaultView = this
      this.navigator = navigator
      this.requestAnimationFrame = raf
      this.cancelAnimationFrame = caf
      this.getComputedStyle = getComputedStyle

      // 应用启动时，提供给需要读取历史信息的库使用
      this.location = new Location({ window: this })
      this.history = new History(this.location, { window: this })

      this.initEvent()
    }

    initEvent () {
      this.on(CONTEXT_ACTIONS.INIT, (pageId: string) => {
        // 页面onload，为该页面建立新的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.INIT, pageId)
      }, null)

      this.on(CONTEXT_ACTIONS.RECOVER, (pageId: string) => {
        // 页面onshow，恢复当前页面的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.RECOVER, pageId)
        this.history.trigger(CONTEXT_ACTIONS.RECOVER, pageId)
      }, null)

      this.on(CONTEXT_ACTIONS.RESTORE, (pageId: string) => {
        // 页面onhide，缓存当前页面的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.RESTORE, pageId)
        this.history.trigger(CONTEXT_ACTIONS.RESTORE, pageId)
      }, null)

      this.on(CONTEXT_ACTIONS.DESTORY, (pageId: string) => {
        // 页面onunload，清除当前页面的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.DESTORY, pageId)
        this.history.trigger(CONTEXT_ACTIONS.DESTORY, pageId)
      }, null)
    }

    addEventListener (event: string, callback: (arg: any)=>void) {
      if (!event || !isString(event)) return
      this.on(event, callback, null)
    }

    removeEventListener (event: string, callback: (arg: any)=>void) {
      if (!event || !isString(event)) return
      this.off(event, callback, null)
    }

    setTimeout (...args: Parameters<typeof setTimeout>) {
      return setTimeout(...args)
    }

    clearTimeout (...args: Parameters<typeof clearTimeout>) {
      return clearTimeout(...args)
    }
  }

  WindowConstructor = Window
}

export const window: any = process.env.TARO_ENV === 'h5' ? win : new WindowConstructor()
// 在某些第三方库中，会全局作用域中直接读取location和history
export const location = window.location
export const history = window.history
