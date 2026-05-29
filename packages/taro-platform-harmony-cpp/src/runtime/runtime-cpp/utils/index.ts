import _display from '@ohos.display'

import { NodeType } from '../dom/node'

import type { TaroElement } from '../dom/element/element'
import type { TaroNode } from '../dom/node'

const display = _display.getDefaultDisplaySync()

export function isElement (node: TaroNode): node is TaroElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

/** @deprecated */
export function convertNumber2PX(value: number): string {
  return `${value}px`
}

/** @deprecated */
export function convertNumber2VP(value: number, unit = 'px'): string {
  if (unit === 'vw' || unit === 'vh') {
    return (value / 100 * (unit === 'vw' ? display.width : display.height)) + 'px'
  }
  return `${value}${unit}`
}

export function getPageScrollerOrNode (scrollerOrNode: any, page: any) {
  if (!page) return scrollerOrNode
  if (page.cacheData) return page.cacheData

  const isArrayData = scrollerOrNode instanceof Array

  if (isArrayData) {
    const index = page.tabBarCurrentIndex || 0

    return scrollerOrNode[index]
  }

  return scrollerOrNode
}

export function ObjectKeys(obj: object): string[] {
  return Object.keys(obj)
}

export function ObjectAssign(...objects) {
  return Object.assign.apply(this, [].concat(...objects))
}

export function callFn (fn: any, ctx: any, ...args: any) {
  if (typeof fn === 'function') {
    return fn.apply(ctx, args)
  }
}
export function bindFn (fn: any, ctx: any, ...args: any) {
  if (typeof fn === 'function') {
    return fn.bind(ctx, ...args)
  }
}

export * from './info'
export * from './router'
export * from '@tarojs/runtime/dist/utils/cache'
