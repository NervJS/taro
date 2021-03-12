
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
export const hostConfig = {
  initNativeApi,
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
