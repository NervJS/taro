import { initNativeApi } from './apis'

export { initNativeApi }
export * from './components'
export const hostConfig = {
  initNativeApi,
  getPathIndex (indexOfNode) {
    return `${indexOfNode}`
  },
  modifyDispatchEvent (event, _tagName) {
    if (event.type === 'click') {
      event.type = 'tap'
    }
  }
}
