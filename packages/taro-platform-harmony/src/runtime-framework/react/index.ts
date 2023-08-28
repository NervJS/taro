import { hooks } from '@tarojs/shared'

import * as taroHooks from './hooks'

// declare const __TARO_FRAMEWORK__: string;

hooks.tap('initNativeApi', function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
})

export * from './app'
export * from './connect'
export * from './page'
