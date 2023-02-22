/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
    const domProp = Object.keys(newVNode).find(k => (newVNode[k]?.setAttribute))
    const dom = domProp ? newVNode[domProp] : null
    const newVNodeProps = newVNode.props
    if (dom) { /** ElementNode */
      for (const propName in newVNodeProps) {
        const propValue = newVNodeProps[propName]
        if (propValue === false && dom.props?.[propName] === undefined) {
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
