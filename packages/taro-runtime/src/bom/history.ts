import { Events } from '../emitter/emitter'
import { isString } from '@tarojs/shared'
import type * as LocationType from './location'

export interface HistoryState {
  state: Record<string, any> | null
  title: string
  url: string
}

export class History extends Events {
  /* private property */
  __location: LocationType.Location
  __stack: HistoryState[] = []
  __cur = 0

  constructor (location: LocationType.Location) {
    super()
    this.__location = location
    this.__stack = [{
      state: null,
      title: '',
      url: ''
    }]

    this.__location.on('__record_history__', (href: string) => {
      this.__cur++
      this.__stack = this.__stack.slice(0, this.__cur)
      this.__stack.push({
        state: null,
        title: '',
        url: href
      })
    }, null)
  }

  /* public property */
  get length () {
    return this.__stack.length
  }

  /* public method */
  go (delta: number) {
    return delta
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  pushState (/* state: unknown, title: string, */ url: string) {
    if (!url || !isString(url)) return 0
    return 1
  }

  replaceState (/* state: unknown, title: string, */ url: string) {
    if (!url || !isString(url)) return 0
    return 2
  }
}
