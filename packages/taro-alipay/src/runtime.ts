import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { initNativeApi } from './apis'
import { components } from './components'

declare const my: any

const hostConfig = {
  initNativeApi,
  getEventCenter (Events) {
    if (!my.taroEventCenter) {
      my.taroEventCenter = new Events()
    }
    return my.taroEventCenter
  }
}

mergeReconciler(hostConfig)
mergeInternalComponents(components)
