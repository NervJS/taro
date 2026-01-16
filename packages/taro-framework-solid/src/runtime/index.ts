import { hooks } from '@tarojs/shared'

import * as taroHooks from './hooks'

hooks.tap('initNativeApi', function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
})

export * from './connect'
export * from './context'
export * from './hooks'
