import { NodeType } from '../dom/node'

import type { TaroElement } from '../dom/element/element'
import type { TaroNode } from '../dom/node'

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

/** @deprecated */
export function convertNumber2PX(value: number): string {
  return `${value}px`
}

/** @deprecated */
export function convertNumber2VP(value: number, unit = 'px'): string {
  return `${value}${unit}`
}

export * from './info'
export * from './router'
export * from '@tarojs/runtime/dist/utils/cache'
