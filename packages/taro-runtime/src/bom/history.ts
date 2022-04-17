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
  #location: LocationType.Location
  #stack: HistoryState[] = []
  #cur: number = 0

  constructor(location: LocationType.Location){
    super()
    this.#location = location
    this.#stack = [{
      state: null,
      title: '',
      url: ''
    }]

    this.#location.on('__record_history__', (href: string) => {
      this.#cur++
      this.#stack = this.#stack.slice(0, this.#cur)
      this.#stack.push({
        state: null,
        title: '',
        url: href
      })
    }, null)
  }

  /* public property */
  get length(){
    return this.#stack.length
  }

  /* public method */
  go(delta: number){
    return delta
  }

  back(){
    this.go(-1)
  }

  forward(){
    this.go(1)
  }

  pushState(state: unknown, title: string, url: string){
    if(!url || !isString(url)) return
  }

  replaceState(state: unknown, title: string, url: string){
    if(!url || !isString(url)) return
  }

}
