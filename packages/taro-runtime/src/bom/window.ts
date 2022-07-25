import { isString } from '@tarojs/shared'

import { Events } from '../emitter/emitter'
import env from '../env'
import { getComputedStyle } from './getComputedStyle'
import { navigator } from './navigator'
import { caf, raf } from './raf'

let window

if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
  class Window extends Events {
    navigator = navigator
    requestAnimationFrame = raf
    cancelAnimationFrame = caf
    getComputedStyle = getComputedStyle
    Date: DateConstructor

    constructor () {
      super()

      const globalProperties = [
        ...Object.getOwnPropertyNames(global || {}),
        ...Object.getOwnPropertySymbols(global || {})
      ]

      globalProperties.forEach(property => {
        if (property === 'atob' || property === 'document') return
        if (!Object.prototype.hasOwnProperty.call(this, property)) {
          this[property] = global[property]
        }
      })

      this.Date ||= Date
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

  window = env.window = new Window()
} else {
  window = env.window
}

export {
  window
}
