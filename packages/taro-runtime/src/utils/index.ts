import { Shortcuts } from '@tarojs/shared'
import { NodeType } from '../dom/node_types'
import {
  ROOT_STR,
  STYLE,
  ID,
  UID,
  CLASS,
  COMMENT
} from '../constants'

import type { TaroElement } from '../dom/element'
import type { TaroText } from '../dom/text'
import type { TaroNode } from '../dom/node'

export const incrementId = () => {
  let id = 0
  return () => (id++).toString()
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

export const customWrapperCache = (function () {
  const _customWrapperRefIdCache = new Map<string, { current: string }>()
  const _customWrapperCache = new WeakMap<{ current: string }, Record<any, any>>()

  const get = (id: string) => {
    const refId = _customWrapperRefIdCache.get(id)
    if (!refId) return null
    return _customWrapperCache.get(refId)
  }

  const set = (id: string, customWrapper: Record<any, any>) => {
    const cachedRefId = _customWrapperRefIdCache.get(id)
    const refId = cachedRefId || Object.create({ current: id })
    if (!cachedRefId && refId) {
      _customWrapperRefIdCache.set(id, refId)
    }
    return _customWrapperCache.set(refId, customWrapper)
  }

  return {
    set,
    get
  }
})()
