import { hooks } from '@tarojs/shared'

import * as taroHooks from './composition-functions'
import { setGlobalDataPlugin } from './plugins'

hooks.tap('initNativeApi', function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
  taro.setGlobalDataPlugin = setGlobalDataPlugin
})

export * from './composition-functions'
export * from './connect'
export * from './connect-native'
export * from './plugins'
