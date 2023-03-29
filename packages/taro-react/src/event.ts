import { TaroElement, TaroEvent } from '@tarojs/runtime'
import { Fiber } from 'react-reconciler'

import { getFiberCurrentPropsFromNode, getInstanceFromNode, getNodeFromInstance } from './componentTree'
import { restoreControlledState, toString } from './domInput'
import { updateValueIfChanged } from './inputValueTracking'
import { Props } from './props'
import { TaroReconciler } from './reconciler' 

let restoreTarget: TaroElement | null = null
let restoreQueue: TaroElement[] | null = null

export function getTargetInstForInputOrChangeEvent (e: TaroEvent, node: TaroElement) {
  const targetInst = getInstanceFromNode(node)
  const domEventName = e.type

  if (!targetInst) return

  if (domEventName === 'input' || domEventName === 'change') {
    const nextValue = toString(e.mpEvent?.detail?.value)

    // setNodeValue(node as FormElement, prevValue)

    return getInstIfValueChanged(targetInst, nextValue)
  }
}

function getInstIfValueChanged (targetInst: Fiber, nextValue: string) {
  const targetNode = getNodeFromInstance(targetInst)

  if (updateValueIfChanged(targetNode, nextValue)) {
    return targetInst
  }
}

export function enqueueStateRestore (target: TaroElement): void {
  if (restoreTarget) {
    if (restoreQueue) {
      restoreQueue.push(target)
    } else {
      restoreQueue = [target]
    }
  } else {
    restoreTarget = target
  }
}

export function needsStateRestore (): boolean {
  return restoreTarget !== null || restoreQueue !== null
}

export function finishEventHandler () {
  const controlledComponentsHavePendingUpdates = needsStateRestore()

  if (controlledComponentsHavePendingUpdates) {
    TaroReconciler.flushSync()
    restoreStateIfNeeded()
  }
}

export function restoreStateIfNeeded () {
  if (!restoreTarget) {
    return
  }

  const target = restoreTarget
  const queuedTargets = restoreQueue
  restoreTarget = null
  restoreQueue = null

  restoreStateOfTarget(target)
  
  if (queuedTargets) {
    for (let i = 0; i < queuedTargets.length; i++) {
      restoreStateOfTarget(queuedTargets[i])
    }
  }
}

function restoreImpl (
  domElement: TaroElement,
  tag: string,
  props: Props,
): void {
  switch (tag) {
    case 'input':
      restoreControlledState(domElement, props)
      break
    // case 'textarea':
    //   ReactDOMTextareaRestoreControlledState(domElement, props)
    //   return
    // case 'select':
    //   ReactDOMSelectRestoreControlledState(domElement, props)
    //   return
  }
}


function restoreStateOfTarget (target: TaroElement) {
  const internalInstance = getInstanceFromNode(target)
  if (!internalInstance) {
    // Unmounted
    return
  }

  const stateNode = internalInstance.stateNode
  // Guard against Fiber being unmounted.
  if (stateNode) {
    const props = getFiberCurrentPropsFromNode(stateNode)
    restoreImpl(internalInstance.stateNode, internalInstance.type, props)
  }
}
