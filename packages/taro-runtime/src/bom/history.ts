import { Events } from '../emitter/emitter'
import { isString, isNumber } from '@tarojs/shared'
import type * as LocationType from './location'

export interface HistoryState {
  state: Record<string, any> | null
  title: string
  url: string
}

type Options = {
  win: any
}

export class History extends Events {
  /* private property */
  __location: LocationType.Location
  __stack: HistoryState[] = []
  __cur = 0

  win: any

  constructor (location: LocationType.Location, options: Options) {
    super()

    this.win = options.win
    this.__location = location

    this.__location.on('__record_history__', (href: string) => {
      this.__cur++
      this.__stack = this.__stack.slice(0, this.__cur)
      this.__stack.push({
        state: null,
        title: '',
        url: href
      })
    }, null)

    this.__location.on('__reset_history__', (href: string) => {
      this.__reset(href)
    }, null)

    this.__reset()
  }

  __reset (href = '') {
    this.__stack = [
      {
        state: null,
        title: '',
        url: href
      }
    ]
    this.__cur = 0
  }

  /* public property */
  get length () {
    return this.__stack.length
  }

  get state () {
    return this.__stack[this.__cur]
  }

  /* public method */
  go (delta: number) {
    if (!isNumber(delta) || isNaN(delta)) return

    let targetIdx = this.__cur + delta
    if (targetIdx < 0) targetIdx = 0
    if (targetIdx >= this.length) targetIdx = this.length - 1
    this.__cur = targetIdx

    this.win.trigger('popstate', this.__stack[this.__cur])
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  pushState (state: any, title: string, url: string) {
    if (!url || !isString(url)) return
    this.__stack = this.__stack.slice(0, this.__cur + 1)
    this.__stack.push({
      state,
      title,
      url
    })
    this.__cur = this.length - 1
  }

  replaceState (state: any, title: string, url: string) {
    if (!url || !isString(url)) return
    this.__stack[this.__cur] = {
      state,
      title,
      url
    }
  }
}
