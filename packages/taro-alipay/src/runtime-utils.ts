
import { initNativeApi } from './apis'

declare const my: any

export { initNativeApi }
export * from './components'
export * from './apis-list'
export const hostConfig = {
  initNativeApi,
  getEventCenter (Events) {
    if (!my.taroEventCenter) {
      my.taroEventCenter = new Events()
    }
    return my.taroEventCenter
  }
}
