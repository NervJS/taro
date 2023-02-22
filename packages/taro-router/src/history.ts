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

import { Action, createBrowserHistory, createHashHistory } from 'history'

import { RouterConfig } from './router'

import type { IH5RouterConfig } from '@tarojs/taro/types/compile'
import type { Blocker, BrowserHistoryOptions, History, Listener, Location, Path, To } from 'history'
import type { StateEvent } from '../types/history'

export let history: History

let basename = '/'

class MpaHistory implements History {
  action: Action
  get location (): Location {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      key: `${window.history.length}`,
      state: window.history.state
    }
  }

  createHref (_to: To): string {
    throw new Error('Method not implemented.')
  }

  parseUrl (to: Partial<Path>) {
    let url = to.pathname || ''
    if (RouterConfig.isPage(url)) {
      url += '.html'
    }
    if (to.search) {
      url += `?${to.search}`
    }
    if (to.hash) {
      url += `#${to.hash}`
    }
    return url
  }

  push (to: Partial<Path>, _state: Record<string, unknown> = {}): void {
    window.location.pathname = this.parseUrl(to)
    // this.pushState(_state, '', this.parseUrl(to))
  }

  replace (to: Partial<Path>, _state: Record<string, unknown> = {}): void {
    window.location.replace(this.parseUrl(to))
    // this.replaceState(_state, '', this.parseUrl(to))
  }

  go (delta: number): void {
    window.history.go(delta)
  }

  back = window.history.back

  forward = window.history.forward

  listen (listener: Listener): () => void {
    function callback (e: StateEvent) {
      if (e.action === 'pushState') {
        listener({ action: Action.Push, location: this.location })
      } else if (e.action === 'replaceState') {
        listener({ action: Action.Replace, location: this.location })
      } else {
        // NOTE: 这里包括 back、forward、go 三种可能，并非是 POP 事件
        listener({ action: Action.Pop, location: this.location })
      }
    }
    window.addEventListener('popstate', callback)
    return () => {
      window.removeEventListener('popstate', callback)
    }
  }

  block (_blocker: Blocker): () => void {
    throw new Error('Method not implemented.')
  }

  pushState: globalThis.History['pushState'] = this.eventState('pushState')
  replaceState: globalThis.History['replaceState'] = this.eventState('replaceState')

  eventState (action: Required<StateEvent>['action']) {
    return (data: any, unused: string, url?: string | URL | null) => {
      const wrapper = window.history[action](data, unused, url)
      const evt: StateEvent = new Event(action)

      evt.action = action
      evt.state = data
      evt.unused = unused
      evt.url = url
      window.dispatchEvent(evt)
      return wrapper
    }
  }
}

export function setHistoryMode (mode?: IH5RouterConfig['mode'], base = '/') {
  const options: BrowserHistoryOptions = {
    window
  }
  basename = base

  if (mode === 'browser') {
    history = createBrowserHistory(options)
  } else if (mode === 'multi') {
    history = new MpaHistory()
  } else {
    // default is hash
    history = createHashHistory(options)
  }
}

export function prependBasename (url = '') {
  return basename.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
}
