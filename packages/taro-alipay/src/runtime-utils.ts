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

import {
  handleSyncApis,
  initNativeApi,
  modifyApis,
  modifyAsyncResult,
  request,
  transformMeta
} from './apis'

declare const my: any

const BUBBLE_EVENTS = new Set([
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',
  'tap',
  'longTap'
])

export {
  handleSyncApis,
  initNativeApi,
  modifyApis,
  modifyAsyncResult,
  request,
  transformMeta
}
export * from './apis-list'
export * from './components'
export const hostConfig = {
  initNativeApi,
  getMiniLifecycle (config) {
    config.component[0] = 'didMount'
    config.component[1] = 'didUnmount'
    return config
  },
  getEventCenter (Events) {
    if (!my.taroEventCenter) {
      my.taroEventCenter = new Events()
    }
    return my.taroEventCenter
  },
  modifyTaroEvent (event, node) {
    if (node.tagName === 'SWIPER' && event.type === 'animationend') {
      event.type = 'animationfinish'
    }
  },
  isBubbleEvents (eventName) {
    return BUBBLE_EVENTS.has(eventName)
  }
}
