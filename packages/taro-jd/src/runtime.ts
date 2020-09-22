import { mergeReconciler } from '@tarojs/shared'
import { initNativeApi } from './apis'

export const hostConfig = {
  initNativeApi
}

mergeReconciler(hostConfig)
