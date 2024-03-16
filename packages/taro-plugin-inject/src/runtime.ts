import { mergeInternalComponents, mergeReconciler, processApis } from '@tarojs/shared'

import { needPromiseApis,noPromiseApis } from './apis-list'
import { components } from './components'

const hostConfig = {
  initNativeApi (taro) {
    const global = taro.miniGlobal
    processApis(taro, global, {
      noPromiseApis,
      needPromiseApis,
      isOnlyPromisify: true
    })
  }
}


mergeReconciler(hostConfig)
mergeInternalComponents(components)
