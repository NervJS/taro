import { initNativeApi } from './apis'
import { capitalize, toCamelCase, internalComponents } from '@tarojs/shared'

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
  isBubbleEvent (eventName: string, _tagName: string) {
    return BUBBLE_EVENTS.has(eventName)
  },
  getPathIndex (indexOfNode) {
    return `${indexOfNode}`
  },
  modifyTaroEvent (event, node) {
    const compName = capitalize(toCamelCase(node.tagName.toLowerCase()))
    if (event.type === 'click' && compName in internalComponents) {
      event.type = 'tap'
    }
  }
}
