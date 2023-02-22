/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { isString } from '@tarojs/shared'

import { CONTEXT_ACTIONS } from '../constants'
import { Events } from '../emitter/emitter'
import env from '../env'
import { getComputedStyle } from './getComputedStyle'
import { History } from './history'
import { Location } from './location'
import { nav as navigator } from './navigator'
import { caf, raf } from './raf'

let window

if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
  class Window extends Events {
    navigator = navigator
    requestAnimationFrame = raf
    cancelAnimationFrame = caf
    getComputedStyle = getComputedStyle
    Date: DateConstructor

    location: Location
    history: History

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

      // 应用启动时，提供给需要读取历史信息的库使用
      this.location = new Location({ window: this })
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

  window = env.window = new Window()
} else {
  window = env.window
}

export const location = window.location
export const history = window.history

export {
  window
}
