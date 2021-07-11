import { initNativeApi } from './apis'
import { capitalize, toCamelCase, internalComponents } from '@tarojs/shared'

export { initNativeApi }
export * from './components'
export const hostConfig = {
  initNativeApi,
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
