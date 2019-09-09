import { MpElement } from '../element'
import { MpText } from '../text'
import { NodeType } from '../node_types'

export type MpHTMLElement = MpElement | MpText

export function isElement (node: MpHTMLElement): node is MpElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function isText (node: MpHTMLElement): node is MpText {
  return node.nodeType === NodeType.TEXT_NODE
}
