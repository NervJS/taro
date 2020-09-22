import { mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { initNativeApi } from './apis'
import { components } from './components'

const hostConfig = {
  initNativeApi,
  getPathIndex (indexOfNode) {
    return indexOfNode
  }
}

mergeReconciler(hostConfig)
mergeInternalComponents(components)
