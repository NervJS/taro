import { Events } from '../emitter/emitter'
import { isString, isNumber } from '@tarojs/shared'
import type * as LocationType from './location'

export interface HistoryState {
  state: Record<string, any> | null
  title: string
  url: string
}

type Options = {
  window: any
}

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
}
