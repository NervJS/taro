import _display from '@ohos.display'
import { getSystemInfoSync, pxTransformHelper } from '@tarojs/taro'

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

export function convertNumber2VP (value: number, unit = 'px'): string | number {
  if (unit === 'vw' || unit === 'vh') {
    return (value / 100 * (unit === 'vw' ? display.width : display.height)) + 'px'
  }
  if (unit === 'PX') {
    // 特殊单位：相当于PX、pX、Px
    return pxTransformHelper(value, 'PX')
  }
  return pxTransformHelper(value, 'vp')
}

export function parseClasses (classNames = ''): string[] {
  if (typeof classNames !== 'string') {
    return []
  }
  return classNames.includes(' ') ? classNames.split(' ') : [classNames]
}

// 合并静态样式，从样式表里面找到对应的样式
export function calcStaticStyle (styleSheet: Record<string, CSSProperties>, classNames = ''): CSSProperties {
  classNames = classNames || '' // 兼容有些开发者传入了false/null等非字符串类型
  const obj: CSSProperties[] = []

  if (!styleSheet.cache) {
    styleSheet.cache = {}
  }
  const cache: Record<string, CSSProperties> = styleSheet.cache as Record<string, CSSProperties>

  const classes = parseClasses(classNames)
  if (!classes.length) return {}
  if (classes.length === 1) {
    // 同一个引用
    return styleSheet[classes[0]]
  } else {
    if (cache[classNames]) {
      return cache[classNames]
    } else {
      for (let i = 0; i < classes.length; i++) {
        const className = classes[i]
        if (styleSheet[className]) {
          obj.push(styleSheet[className])
        }
      }
      const result = Object.assign.apply(null, [{}].concat(obj))

      cache[classNames] = result

      return result
    }
  }
}

// 动态样式计算，需要经过web2harmony进行反转
export function calcDynamicStyle (style: CSSProperties): CSSProperties {
  if (style) {
    return convertWebStyle2HmStyle(style)
  }
  return {}
}

// css env()环境样式获取
export function __env__(safeAreaType: string, fallback?: string | number) {
  const sysInfo = getSystemInfoSync()

  switch (safeAreaType) {
    case 'safe-area-inset-top': {
      return sysInfo.safeArea?.top ? `${sysInfo.safeArea?.top}px` : fallback
    }
    case 'safe-area-inset-right': {
      return sysInfo.safeArea?.right ? `${sysInfo.screenWidth - sysInfo.safeArea?.right}px` : fallback
    }
    case 'safe-area-inset-bottom': {
      return sysInfo.safeArea?.bottom ? `${sysInfo.screenHeight - sysInfo.safeArea?.bottom}px` : fallback
    }
    case 'safe-area-inset-left': {
      return sysInfo.safeArea?.left ? `${sysInfo.safeArea?.left}px` : fallback
    }
  }
  return fallback
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

  const nodeList: T[] = []
  while (queue.length) {
    const currentNode = queue.shift() as T
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

export * from './info'
export * from './router'
