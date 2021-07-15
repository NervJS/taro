
import {
  initNativeApi,
  handleSyncApis,
  transformMeta,
  modifyAsyncResult,
  request
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
  initNativeApi,
  handleSyncApis,
  transformMeta,
  modifyAsyncResult,
  request
}
export * from './components'
export * from './apis-list'
export const hostConfig = {
  initNativeApi,
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
