import _display from '@ohos.display'
import { Current } from '@tarojs/runtime'

import { NodeType } from '../dom/node'
import { initComponentNodeInfo } from '../utils/info'
import { bindAnimation, bindFocus, bindInstanceToNode, bindScrollTo } from './bind'

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

const display = _display.getDefaultDisplaySync()

export function convertNumber2PX (value: number) {
  const config = (Current as any).taro?.pxTransformConfig || {}
  const designWidth = config.designWidth || 750
  return Math.ceil(value / designWidth * px2vp(display.width)) + 'vp'
}

export function convertVP2PX (value: number) {
  const config = (Current as any).taro?.pxTransformConfig || {}
  const designWidth = config.designWidth || 750
  return Math.ceil(value / px2vp(display.width) * designWidth)
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
    const index = page.currentIndex || 0

    return scrollerOrNode[index]
  }

  return scrollerOrNode
}

export class DynamicCenter {
  static checkIsCompileModeAndInstallAfterDOMAction (node: TaroNode, parentNode: TaroNode) {
    if (!parentNode._isCompileMode) return

    parentNode._instance?.dynamicCenter?.install?.(node, parentNode)
  }

  static checkIsCompileModeAndUninstallAfterDOMAction (node: TaroNode) {
    if (!node._isCompileMode) return

    node._instance?.dynamicCenter?.uninstall?.(node)
  }

  install (node: TaroElement, parnetNode: TaroElement) {
    if (!parnetNode._isCompileMode) return

    const component = parnetNode._instance

    this.bindComponentToNodeWithDFS(node, component)
  }

  uninstall (node: TaroElement) {
    if (!node._isCompileMode || !node._instance) return

    node._instance[node._attrs?._dynamicID] = null
    node._instance = null
  }

  bindComponentToNodeWithDFS (node: TaroElement, component) {
    if (!node) return

    const dynamicID = node._attrs?._dynamicID

    // dynamicID 只是为了更新到精准的 node
    // 而为了让半编译模板中每个 node 都能响应 api 的调用，因此 initComponentNodeInfo、bindInstanceToNode 和各种 bindAttribute 都需要执行
    initComponentNodeInfo(component, node)
    bindInstanceToNode(node, component)
    bindFocus(node)
    bindAnimation(node)
    bindScrollTo(node, component)

    node._isCompileMode = true

    if (dynamicID) {
      node._isDynamicNode = true
      component[dynamicID] = node
    }

    if (!node.childNodes || !node.childNodes.length) return

    for (let i = 0; i < node.childNodes.length; i++) {
      // @ts-ignore
      this.bindComponentToNodeWithDFS(node.childNodes[i], component)
    }
  }
}
