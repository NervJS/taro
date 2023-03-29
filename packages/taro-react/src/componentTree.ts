import { TaroElement } from '@tarojs/runtime'
import { Fiber } from 'react-reconciler'

import { Props } from './props'
import { HostComponent, HostRoot, HostText, SuspenseComponent } from './workTags'

const randomKey = Math.random()
  .toString(36)
  .slice(2)

const internalPropsKey = '__reactProps$' + randomKey
const internalInstanceKey = '__reactFiber$' + randomKey
const internalContainerInstanceKey = '__reactContainer$' + randomKey
// const internalEventHandlersKey = '__reactEvents$' + randomKey
// const internalEventHandlerListenersKey = '__reactListeners$' + randomKey
// const internalEventHandlesSetKey = '__reactHandles$' + randomKey

export function precacheFiberNode (hostInst: Fiber, node: TaroElement): void {
  node[internalInstanceKey] = hostInst
}

export function markContainerAsRoot (hostRoot: Fiber, node: TaroElement): void {
  node[internalContainerInstanceKey] = hostRoot
}

export function unmarkContainerAsRoot (node: TaroElement): void {
  node[internalContainerInstanceKey] = null
}

export function isContainerMarkedAsRoot (node: TaroElement): boolean {
  return !!node[internalContainerInstanceKey]
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
export function getInstanceFromNode (node: TaroElement): Fiber | null {
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

export function getFiberCurrentPropsFromNode (node: TaroElement): Props {
  return node[internalPropsKey] || null
}

export function updateFiberProps (
  node: TaroElement,
  props: Props,
): void {
  node[internalPropsKey] = props
}
