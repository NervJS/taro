import {
  container,
  SERVICE_IDENTIFIER
} from '@tarojs/runtime'
import * as taroHooks from './hooks'

import type { IHooks } from '@tarojs/runtime'

declare const __TARO_FRAMEWORK__: string

const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

hooks.initNativeApiImpls ||= []
hooks.initNativeApiImpls.push(function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
})

if (__TARO_FRAMEWORK__ === 'preact') {
  hooks.modifyMpEventImpls?.push(e => {
    if (e.type === 'tap') e.type = 'click'
  })
  hooks.modifyDispatchEventImpls?.push(e => {
    const type = e.type
    e.type = type[0].toUpperCase() + type.slice(1)
  })
}

export * from './hooks'
export * from './connect'
export * from './connect-native'
