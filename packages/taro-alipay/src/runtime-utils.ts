
import {
  initNativeApi,
  handleSyncApis,
  transformMeta,
  modifyAsyncResult,
  request
} from './apis'

declare const my: any

export {
  initNativeApi,
  handleSyncApis,
  transformMeta,
  modifyAsyncResult,
  request
}
export * from './components'
export * from './apis-list'

// 见 https://opendocs.alipay.com/mini/framework/events
const BUBBLE_EVENTS = new Set([
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',
  'tap',
  'longTap'
])

export const hostConfig = {
  initNativeApi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBubbleEvent (eventName: string, tagName: string) {
    return BUBBLE_EVENTS.has(eventName)
  },
  getEventCenter (Events) {
    if (!my.taroEventCenter) {
      my.taroEventCenter = new Events()
    }
    return my.taroEventCenter
  },
  modifyDispatchEvent (event, tagName) {
    if (tagName === 'SWIPER' && event.type === 'animationend') {
      event.type = 'animationfinish'
    }
  }
}
