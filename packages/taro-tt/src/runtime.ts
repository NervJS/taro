import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { initNativeApi } from './apis'
import { components } from './components'

export const hostConfig = {
  initNativeApi
}

mergeReconciler(hostConfig)
mergeInternalComponents(components)
