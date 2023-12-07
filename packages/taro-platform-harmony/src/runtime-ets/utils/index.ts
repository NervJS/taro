import { pxTransformHelper } from '@tarojs/taro'

import { NodeType } from '../dom/node'

import type { CSSProperties } from 'react'
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

// FIXME 当前样式转换、@tarojs/runtime 中尺寸使用该方法，暂不修复
export function convertNumber2PX (value: number) {
  return pxTransformHelper(value, 'vp')
}

export function convertNumber2VP (value: number) {
  return pxTransformHelper(value, 'vp')
}

export function calcDynamicStyle (styleSheet: Record<string, CSSProperties>, classNames: string, style: CSSProperties): CSSProperties {
  const obj: CSSProperties[] = []
  const classes = typeof classNames === 'string' ? classNames.split(' ') : []
  for (let i = 0; i < classes.length; i++) {
    const className = classes[i]
    if (styleSheet[className]) {
      obj.push(styleSheet[className])
    }
  }
  obj.push(style)
  return Object.assign.apply(null, [{}].concat(obj))
}

export function getPageScrollerOrNode (scrollerOrNode: any, page: any) {
  if (!page) return scrollerOrNode

  const isArrayData = scrollerOrNode instanceof Array

  if (isArrayData) {
    const index = page.tabBarCurrentIndex || 0

    return scrollerOrNode[index]
  }

  return scrollerOrNode
}

export function ObjectAssign(...objects) {
  return Object.assign.apply(this, [{}].concat(...objects))
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


// 使用深度优先遍历寻找节点树中对应的子节点，且只需要找到第一个
// 通过 selector 判断是 id 还是 selector，从 node 的 id 和 className 属性中寻找
export function findChildNodeWithDFS<T extends TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll: true): TaroElement[] | null;
export function findChildNodeWithDFS<T extends TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll?: false): TaroElement | null;
export function findChildNodeWithDFS<T extends TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll: boolean): TaroElement[] | TaroElement | null;
export function findChildNodeWithDFS<T extends TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll): TaroElement[] | TaroElement | null {
  const queue = [node]

  const nodeList: TaroElement[] = []
  while (queue.length) {
    const currentNode = queue.shift()
    if (currentNode) {
      if (typeof selector === 'string') {
        if (selector.startsWith('#')) {
          // @ts-ignore
          const id = currentNode.id || currentNode._nid
          if (id === selector.slice(1)) {
            nodeList.push(currentNode)
            if (!selectAll) break
          }
        } else {
          if (currentNode.className?.includes(selector.slice(1))) {
            nodeList.push(currentNode)
            if (!selectAll) break
          }
        }
      } else if (typeof selector === 'function') {
        if (selector(currentNode)) {
          nodeList.push(currentNode)
          if (!selectAll) break
        }
      }

      if (currentNode.childNodes && currentNode.childNodes.length) {
        // @ts-ignore
        queue.push(...currentNode.childNodes)
      }
    }
  }

  if (nodeList.length) {
    return selectAll ? nodeList : nodeList[0]
  }

  return null
}

export type TaroAny = any
export type TaroFunc = (...args: TaroAny[]) => TaroAny
export type TaroIndent = string | number | boolean | undefined | null
export type TaroObject = Record<string | number | symbol, TaroAny>
