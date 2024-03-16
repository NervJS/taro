/**
 * 给 TaroElement 绑定 react fiber、react props 等属性
 * 提供 fiber -> element、element -> fiber、element -> props 的方法
*/

import { internalContainerInstanceKey, internalInstanceKey, internalPropsKey } from './constant'
import { HostComponent, HostRoot, HostText, SuspenseComponent } from './workTags'

import type { TaroElement, TaroText } from '@tarojs/runtime'
import type { Fiber } from 'react-reconciler'
import type { Props } from './props'


export function precacheFiberNode (hostInst: Fiber, node: TaroElement | TaroText): void {
  node[internalInstanceKey] = hostInst
}

export function markContainerAsRoot (hostRoot: Fiber, node: TaroElement | TaroText): void {
  node[internalContainerInstanceKey] = hostRoot
}

export function unmarkContainerAsRoot (node: TaroElement | TaroText): void {
  node[internalContainerInstanceKey] = null
}

export function isContainerMarkedAsRoot (node: TaroElement | TaroText): boolean {
  return !!node[internalContainerInstanceKey]
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
export function getInstanceFromNode (node: TaroElement | TaroText): Fiber | null {
  const inst = node[internalInstanceKey] || node[internalContainerInstanceKey]

  if (inst) {
    if (
      inst.tag === HostComponent ||
      inst.tag === HostText ||
      inst.tag === SuspenseComponent ||
      inst.tag === HostRoot
    ) {
      return inst
    } else {
      return null
    }
  }
  return null
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
export function getNodeFromInstance (inst: Fiber) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber this, is just the state node right now. We assume it will be
    // a host component or host text.
    return inst.stateNode
  }
}

export function getFiberCurrentPropsFromNode (node: TaroElement | TaroText): Props {
  return node[internalPropsKey] || null
}

export function updateFiberProps (
  node: TaroElement | TaroText,
  props: Props,
): void {
  node[internalPropsKey] = props
}
