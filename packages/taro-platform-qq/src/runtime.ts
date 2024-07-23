import { mergeInternalComponents, mergeReconciler } from '@tarojs/shared'

import { components as wxComponents } from '../../taro-platform-weapp/dist/runtime-utils'
import { initNativeApi } from './apis'
import { components } from './components'

export const hostConfig = {
  initNativeApi
}

mergeReconciler(hostConfig)
mergeInternalComponents(wxComponents)
mergeInternalComponents(components)
