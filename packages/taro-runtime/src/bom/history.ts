/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { isNumber,isString } from '@tarojs/shared'

import { CONTEXT_ACTIONS } from '../constants'
import { Events } from '../emitter/emitter'
import { RuntimeCache } from '../utils/cache'

import type * as LocationType from './location'

export interface HistoryState {
  state: Record<string, any> | null
  title: string
  url: string
}

type Options = {
  window: any
}
type HistoryContext = {
  location: LocationType.Location
  stack: HistoryState[]
  cur: number
}
const cache = new RuntimeCache<HistoryContext>('history')

export class History extends Events {
  /* private property */
  #location: LocationType.Location
  #stack: HistoryState[] = []
  #cur = 0

  #window: any

  constructor (location: LocationType.Location, options: Options) {
    super()

    this.#window = options.window
    this.#location = location

    this.#location.on('__record_history__', (href: string) => {
      this.#cur++
      this.#stack = this.#stack.slice(0, this.#cur)
      this.#stack.push({
        state: null,
        title: '',
        url: href
      })
    }, null)

    this.#location.on('__reset_history__', (href: string) => {
      this.#reset(href)
    }, null)

    // 切换上下文行为

    this.on(CONTEXT_ACTIONS.INIT, () => {
      this.#reset()
    }, null)

    this.on(CONTEXT_ACTIONS.RESTORE, (pageId: string) => {
      cache.set(pageId, {
        location: this.#location,
        stack: this.#stack.slice(),
        cur: this.#cur
      })
    }, null)

    this.on(CONTEXT_ACTIONS.RECOVER, (pageId: string) => {
      if (cache.has(pageId)) {
        const ctx = cache.get(pageId)!
        this.#location = ctx.location
        this.#stack = ctx.stack
        this.#cur = ctx.cur
      }
    }, null)

    this.on(CONTEXT_ACTIONS.DESTORY, (pageId: string) => {
      cache.delete(pageId)
    }, null)

    this.#reset()
  }

  #reset (href = '') {
    this.#stack = [
      {
        state: null,
        title: '',
        url: href || this.#location.href
      }
    ]
    this.#cur = 0
  }

  /* public property */
  get length () {
    return this.#stack.length
  }

  get state () {
    return this.#stack[this.#cur]
  }

  /* public method */
  go (delta: number) {
    if (!isNumber(delta) || isNaN(delta)) return

    let targetIdx = this.#cur + delta
    targetIdx = Math.min(Math.max(targetIdx, 0), this.length - 1)

    this.#cur = targetIdx

    this.#location.trigger('__set_href_without_history__', this.#stack[this.#cur].url)
    this.#window.trigger('popstate', this.#stack[this.#cur])
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  pushState (state: any, title: string, url: string) {
    if (!url || !isString(url)) return
    this.#stack = this.#stack.slice(0, this.#cur + 1)
    this.#stack.push({
      state,
      title,
      url
    })
    this.#cur = this.length - 1

    this.#location.trigger('__set_href_without_history__', url)
  }

  replaceState (state: any, title: string, url: string) {
    if (!url || !isString(url)) return
    this.#stack[this.#cur] = {
      state,
      title,
      url
    }

    this.#location.trigger('__set_href_without_history__', url)
  }

  // For debug
  get cache () {
    return cache
  }
}
