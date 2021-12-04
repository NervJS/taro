import {
  container,
  SERVICE_IDENTIFIER
} from '@tarojs/runtime'
import * as taroHooks from './composition-functions'
import { setGlobalDataPlugin } from './plugins'

import type { IHooks } from '@tarojs/runtime'

const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

hooks.initNativeApiImpls ||= []
hooks.initNativeApiImpls.push(function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
  taro.setGlobalDataPlugin = setGlobalDataPlugin
})

export * from './connect'
export * from './composition-functions'
export * from './plugins'
