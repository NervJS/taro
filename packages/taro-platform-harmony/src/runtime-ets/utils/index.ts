import _display from '@ohos.display'

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


const display = _display.getDefaultDisplaySync()

export function convertNumber2PX (value: number) {
  return Math.ceil(value / 750 * px2vp(display.width)) + 'vp'
}

export function convertVP2PX (value: number) {
  return Math.ceil(value / px2vp(display.width) * 750)
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

export function bindInstanceToNode (node: TaroElement, component: object) {
  if (!node) return

  node._instance = component

  // 触发appear，让node监听到TaroNode已经和ete自定义组件绑定上
  // @ts-ignore
  node.resolveAppear?.() // #text node节点没有实现该方法
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

  bindComponentToNodeWithDFS (node: TaroElement, component, path = '') {
    if (!node) return

    const dynamicID = node._attrs?._dynamicID
  
    if (dynamicID) {
      node._isCompileMode = true
      component[dynamicID] = node
      
      bindInstanceToNode(node, component)
    }
  
    if (!node.childNodes || !node.childNodes.length) return
  
    for (let i = 0; i < node.childNodes.length; i++) {
      // @ts-ignore
      this.bindComponentToNodeWithDFS(node.childNodes[i], component, path + i.toString())
    }
  }
}
