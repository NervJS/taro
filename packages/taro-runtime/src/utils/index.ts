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

import type { TaroElement } from '../dom/element'
import type { TaroNode } from '../dom/node'
import type { TaroText } from '../dom/text'
import type { TFunc } from '../interface'

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
  while ((node = node?.parentElement || null)) {
    if (!node || node.nodeName === ROOT_STR || node.nodeName === 'root-portal') {
      return false
    } else if (node.__handlers[type]?.length) {
      return true
    }
  }

  return false
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

export function extend (ctor: Ctor, methodName: string, options: TFunc | Record<string, any>) {
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

export function convertNumber2PX (value: number) {
  return value + 'px'
}

export * from './lodash'
export * from './router'
