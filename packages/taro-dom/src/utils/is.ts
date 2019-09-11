import { TaroElement } from '../element'
import { Taro } from '../text'
import { NodeType } from '../node_types'

export type MpHTMLElement = TaroElement | Taro

export function isElement (node: MpHTMLElement): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function isText (node: MpHTMLElement): node is Taro {
  return node.nodeType === NodeType.TEXT_NODE
}

export const isArray = Array.isArray

export function isString (o: unknown): o is string {
  return typeof o === 'string'
}
