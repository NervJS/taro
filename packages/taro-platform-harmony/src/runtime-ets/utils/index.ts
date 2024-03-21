import _display from '@ohos.display'
import { pxTransformHelper } from '@tarojs/taro'

import { NodeType } from '../dom/node'
import convertWebStyle2HmStyle from '../dom/stylesheet/covertWeb2Hm'

import type { CSSProperties } from 'react'
import type { TaroElement } from '../dom/element/element'
import type { TaroNode } from '../dom/node'

const display = _display.getDefaultDisplaySync()

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

// 全局的变量内容
export const globalCss = {
  map: {}
}

// Css变量的var方法
export function __var_fn(value: string | (() => string), ...rest: any[]) {
  if (typeof value === 'function') {
    const res = value()
    return typeof res !== 'undefined' ? res : (rest && (rest instanceof Array ? __var_fn.apply(null, rest) : __var_fn(rest)))
  }
  return typeof value !== 'undefined' ? value: (rest && (rest instanceof Array ? __var_fn.apply(null, rest) : __var_fn(rest)))
}

// Css变量的var方法，延迟获取变量
export function __lazy_var_fn(fn, ...rest: any[]) {
  return () => (fn() || __var_fn.apply(null, rest))
}

export function convertNumber2VP (value: number, unit = 'px') {
  if (unit === 'vw' || unit === 'vh') {
    return (value / 100 * (unit === 'vw' ? display.width: display.height)) + 'px'
  }
  if (unit === 'PX') {
    // 特殊单位：相当于PX、pX、Px
    return pxTransformHelper(value, 'PX')
  }
  return pxTransformHelper(value, 'vp')
}

export function parseClasses (classNames: string | string[] = []): string[] {
  if (typeof classNames === 'string') {
    return classNames.includes(' ') ? classNames.split(' ') : [classNames]
  } else if (Array.isArray(classNames)) {
    return classNames // Note: 不考虑支持单个元素传入多个类名的情况，过于损耗性能
  }

  return []
}

// 合并静态样式，从样式表里面找到对应的样式
export function calcStaticStyle (styleSheet: Record<string, CSSProperties>, classNames: string | string[] = [], style: CSSProperties): CSSProperties {
  const obj: CSSProperties[] = []
  const classes = parseClasses(classNames)
  if (classes.length === 1) {
    if (style) {
      return Object.assign({}, styleSheet[classes[0]], style)
    } else {
      // 同一个引用
      return styleSheet[classes[0]]
    }
  } else {
    for (let i = 0; i < classes.length; i++) {
      const className = classes[i]
      if (styleSheet[className]) {
        obj.push(styleSheet[className])
      }
    }
    if (style) {
      obj.push(style)
    }
    return Object.assign.apply(null, [{}].concat(obj))
  }
}

// 动态样式计算，需要经过web2harmony进行反转
export function calcDynamicStyle (style: CSSProperties): CSSProperties {
  if (style) {
    return convertWebStyle2HmStyle(style)
  }
  return {}
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

export function ObjectKeys(obj: object): string[] {
  return Object.keys(obj)
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
export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll: true): T[] | null;
export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll?: false): T | null;
export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll: boolean): T[] | T | null;
export function findChildNodeWithDFS<T extends TaroElement = TaroElement> (node: TaroElement, selector: string | ((ele: T) => boolean), selectAll): T[] | T | null {
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
