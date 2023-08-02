import { NodeType } from '../dom/node'

import type { TaroElement } from '../dom/element'
import type { TaroNode } from '../dom/node'

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
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

export function convertNumber2PX (value: number) {
  return Math.ceil(value / 750 * 384) + 'vp'
}
