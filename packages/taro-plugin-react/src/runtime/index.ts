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
  const options = require('preact').options
  const oldVNodeHook = options.vnode
  options.vnode = vnode => {
    const { type, props } = vnode
    let normalizedProps = props

    // only normalize props on Element nodes
    if (typeof type === 'string') {
      normalizedProps = {}

      for (let i in props) {
        const value = props[i]

        if (/^on/.test(i)) {
          i = i.toLowerCase()
        }

        normalizedProps[i] = value
      }

      vnode.props = normalizedProps
    }

    if (oldVNodeHook) oldVNodeHook(vnode)
  }

  hooks.modifyMpEventImpls?.push(e => {
    const type = e.type
    if (type === 'tap') {
      e.type = 'click'
    } else if (type === 'focus') {
      // 兼容 preact/compat/src/render.js options.vnode 的处理逻辑
      e.type = 'focusin'
    } else if (type === 'blur') {
      e.type = 'focusout'
    }
  })
  // hooks.modifyDispatchEventImpls?.push(e => {
  // })
}

export * from './hooks'
export * from './connect'
export * from './connect-native'
