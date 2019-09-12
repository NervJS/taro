import { TaroElement } from '../element'
import { TaroText } from '../text'
import { NodeType } from '../node_types'
import { TaroNode } from 'src/node'

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function isText (node: TaroNode): node is TaroText {
  return node.nodeType === NodeType.TEXT_NODE
}

export const isArray = Array.isArray

export function isString (o: unknown): o is string {
  return typeof o === 'string'
}

export function isUndefined (o: unknown): o is undefined {
  return typeof o === 'undefined'
}
