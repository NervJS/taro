import { TaroElement } from '../dom/element'
import { TaroText } from '../dom/text'
import { NodeType } from '../dom/node_types'
import { TaroNode } from '../dom/node'

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
