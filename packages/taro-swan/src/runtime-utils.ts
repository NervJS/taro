
import { initNativeApi } from './apis'

export { initNativeApi }
export * from './components'
export * from './apis-list'
export const hostConfig = {
  initNativeApi,
  getPathIndex (indexOfNode) {
    return indexOfNode
  }
}
