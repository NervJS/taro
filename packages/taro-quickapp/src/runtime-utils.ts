import { initNativeApi } from './apis'

export { initNativeApi }
export * from './components'

// 见 https://doc.quickapp.cn/widgets/common-events.html
const BUBBLE_EVENTS = new Set([
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'click',
  'longpress'
])

export const hostConfig = {
  initNativeApi,
  isBubbleEvents (eventName: string, _tagName: string) {
    return BUBBLE_EVENTS.has(eventName)
  },
  getPathIndex (indexOfNode) {
    return `${indexOfNode}`
  },
  modifyBindEventName (eventName: string, _compName: string) {
    return eventName
  }
}
