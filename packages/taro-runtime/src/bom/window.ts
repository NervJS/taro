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

      this.document = document // TODO:
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
      this.on(CONTEXT_ACTIONS.INIT, (uniqId: string) => {
        // 页面onload，为该页面建立新的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.INIT, uniqId)
      }, null)

      this.on(CONTEXT_ACTIONS.RECOVER, (uniqId: string) => {
        // 页面onshow，恢复当前页面的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.RECOVER, uniqId)
        this.history.trigger(CONTEXT_ACTIONS.RECOVER, uniqId)
      }, null)

      this.on(CONTEXT_ACTIONS.RESTORE, (uniqId: string) => {
        // 页面onhide，缓存当前页面的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.RESTORE, uniqId)
        this.history.trigger(CONTEXT_ACTIONS.RESTORE, uniqId)
      }, null)

      this.on(CONTEXT_ACTIONS.DESTORY, (uniqId: string) => {
        // 页面onunload，清除当前页面的上下文信息
        this.location.trigger(CONTEXT_ACTIONS.DESTORY, uniqId)
        this.history.trigger(CONTEXT_ACTIONS.DESTORY, uniqId)
      }, null)
    }

    // get document () {
    //   return document
    // }

    // get navigator () {
    //   return navigator
    // }

    // get requestAnimationFrame () {
    //   return raf
    // }

    // get cancelAnimationFrame () {
    //   return caf
    // }

    // get getComputedStyle () {
    //   return getComputedStyle
    // }

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

// function proxyToWindow(instance: string){
//   if(process.env.TARO_ENV === 'h5'){
//     return window[instance]
//   }

//   const keys = Object.getOwnPropertyNames(window[instance])
//   const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(window[instance]))
//   console.log(instance, 'keys', keys.concat(protoKeys).join(','))
//   let proxy = {}
//   keys.concat(protoKeys).forEach( key =>{
//     Object.defineProperty(proxy, key, {
//       get: function(){
//         console.log('读取', instance, key, window[instance][key], window.history.name)
//         return window[instance][key]  // TODO: 这个貌似缓存住了
//       },
//       set: function(val){
//         console.log('设置', instance, key, val, window.history.name)
//         window[instance][key] = val
//       }
//     })
//   })
//   return proxy
// }
// 每次读到的都是window上最新的值
// export const location = proxyToWindow('location')
// export const history = proxyToWindow('history')
export const location = window.location
export const history = window.history

// if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
//   const globalProperties = [
//     ...Object.getOwnPropertyNames(global || win),
//     ...Object.getOwnPropertySymbols(global || win)
//   ]

//   globalProperties.forEach(property => {
//     if (property === 'atob') return
//     if (!Object.prototype.hasOwnProperty.call(window, property)) {
//       window[property] = global[property]
//     }
//   })

//   window.requestAnimationFrame = raf
//   window.cancelAnimationFrame = caf
//   window.getComputedStyle = getComputedStyle
//   window.addEventListener = noop
//   window.removeEventListener = noop
//   if (!(DATE in window)) {
//     window.Date = Date
//   }
//   window.setTimeout = function (...args: Parameters<typeof setTimeout>) {
//     return setTimeout(...args)
//   }
//   window.clearTimeout = function (...args: Parameters<typeof clearTimeout>) {
//     return clearTimeout(...args)
//   }

//   document.defaultView = window
// }
