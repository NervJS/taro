import { components as wxComponents } from '@tarojs/plugin-platform-weapp/dist/runtime-utils'
import { mergeInternalComponents, mergeReconciler } from '@tarojs/shared'

import { initNativeApi } from './apis'
import { components } from './components'

export const hostConfig = {
  initNativeApi
}

mergeReconciler(hostConfig)
mergeInternalComponents(wxComponents)
mergeInternalComponents(components)
