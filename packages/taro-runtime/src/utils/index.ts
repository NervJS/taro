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

export function isHasExtractProp (el: TaroElement): boolean {
  const res = Object.keys(el.props).find(prop => {
    return !(/^(class|style|id)$/.test(prop) || prop.startsWith('data-'))
  })
  return Boolean(res)
}

export function escapeForHtmlGeneration (value: string): string {
  return value.replace(/"/g, '&quot;')
}

/**
 * 驼峰转连字符
 */
export function toDash (str) {
  return str.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`)
}
