import { hooks } from '@tarojs/shared'

import * as taroHooks from './hooks'

declare const __TARO_FRAMEWORK__: string

hooks.tap('initNativeApi', function (taro) {
  for (const hook in taroHooks) {
    taro[hook] = taroHooks[hook]
  }
})

if (__TARO_FRAMEWORK__ === 'preact') {
  const options = require('preact').options
  const oldVNodeHook = options.vnode
  const oldDiffedHook = options.diffed
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

        if (type === 'map' && i === 'onregionchange') {
          // map 组件的 regionchange 事件非常特殊，详情：https://github.com/NervJS/taro/issues/5766
          normalizedProps.onbegin = value
          normalizedProps.onend = value
          continue
        }

        normalizedProps[i] = value
      }

      vnode.props = normalizedProps
    }

    if (oldVNodeHook) oldVNodeHook(vnode)
  }
  options.diffed = function (newVNode) {
    const dom = newVNode._dom
    const newVNodeProps = newVNode.props
    if (dom) { /** ElementNode */
      for (const propName in newVNodeProps) {
        const propValue = newVNodeProps[propName]
        if (propValue === false && dom.props[propName] === undefined) {
          // 值为 false 的属性在 Preact 的 diff 中被 removeAttribute 了，这里手动 setAttribute
          // fix https://github.com/NervJS/taro/issues/11197
          dom.setAttribute(propName, propValue)
        }
      }
    }
    if (oldDiffedHook) oldDiffedHook(newVNode)
  }

  hooks.tap('modifyMpEvent', e => {
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

export * from './connect'
export * from './connect-native'
export * from './hooks'
