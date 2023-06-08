import { hooks } from '@tarojs/shared'
import { toRaw } from 'vue'

import * as taroHooks from './composition-functions'
import { setGlobalDataPlugin } from './plugins'

hooks.tap('initNativeApi', function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
  taro.setGlobalDataPlugin = setGlobalDataPlugin
})

hooks.tap('proxyToRaw', function (proxyObj) {
  return toRaw(proxyObj)
})

export * from './composition-functions'
export * from './connect'
export * from './connect-native'
export * from './plugins'
