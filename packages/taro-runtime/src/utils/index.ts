/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import {
  getComponentsAlias as _getComponentsAlias,
  internalComponents,
  isFunction,
  Shortcuts
} from '@tarojs/shared'

import {
  CLASS,
  COMMENT,
  ID,
  ROOT_STR,
  STYLE,
  UID
} from '../constants'
import { NodeType } from '../dom/node_types'
import { Func } from '../interface'

import type { TaroElement } from '../dom/element'
import type { TaroNode } from '../dom/node'
import type { TaroText } from '../dom/text'

export const incrementId = () => {
  const chatCodes: number[] = []
  // A-Z
  for (let i = 65; i <= 90; i++) {
    chatCodes.push(i)
  }
  // a-z
  for (let i = 97; i <= 122; i++) {
    chatCodes.push(i)
  }
  const chatCodesLen = chatCodes.length - 1
  const list = [0, 0]
  return () => {
    const target = list.map(item => chatCodes[item])
    const res = String.fromCharCode(...target)

    let tailIdx = list.length - 1

    list[tailIdx]++

    while (list[tailIdx] > chatCodesLen) {
      list[tailIdx] = 0
      tailIdx = tailIdx - 1
      if (tailIdx < 0) {
        list.push(0)
        break
      }
      list[tailIdx]++
    }

    return res
  }
}

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function isText (node: TaroNode): node is TaroText {
  return node.nodeType === NodeType.TEXT_NODE
}

export function isComment (node: TaroNode): boolean {
  return node.nodeName === COMMENT
}

export function isHasExtractProp (el: TaroElement): boolean {
  const res = Object.keys(el.props).find(prop => {
    return !(/^(class|style|id)$/.test(prop) || prop.startsWith('data-'))
  })
  return Boolean(res)
}

/**
 * 往上寻找组件树直到 root，寻找是否有祖先组件绑定了同类型的事件
 * @param node 当前组件
 * @param type 事件类型
 */
export function isParentBinded (node: TaroElement | null, type: string): boolean {
  let res = false
  while (node?.parentElement && node.parentElement._path !== ROOT_STR) {
    if (node.parentElement.__handlers[type]?.length) {
      res = true
      break
    }
    node = node.parentElement
  }
  return res
}

export function shortcutAttr (key: string): string {
  switch (key) {
    case STYLE:
      return Shortcuts.Style
    case ID:
      return UID
    case CLASS:
      return Shortcuts.Class
    default:
      return key
  }
}

export const customWrapperCache = new Map<string, Record<string, any>>()

interface Ctor {
  new (...args: any[]): any
}

export function extend (ctor: Ctor, methodName: string, options: Func | Record<string, any>) {
  if (isFunction(options)) {
    options = {
      value: options
    }
  }
  Object.defineProperty(ctor.prototype, methodName, {
    configurable: true,
    enumerable: true,
    ...options
  })
}

let componentsAlias
export function getComponentsAlias () {
  if (!componentsAlias) {
    componentsAlias = _getComponentsAlias(internalComponents)
  }
  return componentsAlias
}
