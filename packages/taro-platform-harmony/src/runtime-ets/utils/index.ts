import { NodeType } from '../dom/Node'

import type { TaroElement } from '../dom/Element'
import type { TaroNode } from '../dom/Node'

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function toCamelCase (s: string): string {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export function UpperFirstLetter (s: string): string {
  return s.replace(/^[a-z]/, match => {
    return match.toUpperCase()
  })
}

export function toDashed (s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 往上寻找组件树直到 root，寻找是否有祖先组件绑定了同类型的事件
 * @param node 当前组件
 * @param type 事件类型
 */
export function isParentBinded (node: TaroElement | null, type: string): boolean {
  let res = false
  
  // TODO: 当前 node 结构没有 root，因此不作判断，后续可根据情况添加 root 条件
  while (node?.parentElement) {
    if (node.parentElement.__listeners[type]?.length) {
      res = true
      break
    }
    node = node.parentElement
  }

  return res
}

export function transformPxSize (value: number) {
  return Math.ceil(value / 750 * 384) + 'vp'
}
