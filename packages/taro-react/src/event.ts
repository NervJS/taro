import { TaroElement, TaroEvent } from '@tarojs/runtime'
import { Fiber } from 'react-reconciler'

import { getFiberCurrentPropsFromNode, getInstanceFromNode, getNodeFromInstance } from './componentTree'
import { isTextInputElement, ReactDOMInputRestoreControlledState, ReactDOMTextareaRestoreControlledState, toString } from './domInput'
import { updateValueIfChanged } from './inputValueTracking'
import { Props } from './props'
import { TaroReconciler } from './reconciler' 


export type RestoreType =  string | number | boolean | any[]

interface RestoreItem {
  target: TaroElement
  value: RestoreType
}

let restoreQueue: RestoreItem[] | null = null

// 对比 TaroElement tracker 下的 value 和事件下的 value，判断 element 的值是否存在更改
export function getTargetInstForInputOrChangeEvent (e: TaroEvent, node: TaroElement) {
  const targetInst = getInstanceFromNode(node)
  const domEventName = e.type

  if (!targetInst || !isTextInputElement(node)) return

  if (domEventName === 'input' || domEventName === 'change') {
    const nextValue = toString(e.mpEvent?.detail?.value)

    return getInstIfValueChanged(targetInst, nextValue)
  }
}


function getInstIfValueChanged (targetInst: Fiber, nextValue: string) {
  const targetNode = getNodeFromInstance(targetInst)

  if (!targetNode) return false

  if (updateValueIfChanged(targetNode, nextValue)) {
    return targetInst
  }
}

// 把 target 塞入更新队列中
export function enqueueStateRestore (target: RestoreItem): void {
  if (restoreQueue) {
    restoreQueue.push(target)
  } else {
    restoreQueue = [target]
  }
}

// 判断是否需要恢复 target（input、textarea） 的状态
export function needsStateRestore (): boolean {
  return restoreQueue !== null
}

export function finishEventHandler () {
  const controlledComponentsHavePendingUpdates = needsStateRestore()

  if (controlledComponentsHavePendingUpdates) {
    TaroReconciler.flushSync()
    restoreStateIfNeeded()
  }
}

// 遍历 restoreQueue、restoreTarget，恢复其状态
export function restoreStateIfNeeded () {
  if (!restoreQueue) {
    return
  }

  const queuedTargets = restoreQueue
  restoreQueue = null

  for (let i = 0; i < queuedTargets.length; i++) {
    restoreStateOfTarget(queuedTargets[i])
  }
}

function restoreImpl (
  domElement: TaroElement,
  tag: string,
  oldValue: string | number | boolean | any[],
  props: Props,
): void {
  switch (tag) {
    case 'input':
      ReactDOMInputRestoreControlledState(domElement, oldValue, props)
      break
    case 'textarea':
      ReactDOMTextareaRestoreControlledState(domElement, oldValue, props)
      break
  }
}


function restoreStateOfTarget (item: RestoreItem) {
  const internalInstance = getInstanceFromNode(item.target)

  if (!internalInstance) return

  const { stateNode, type } = internalInstance

  if (stateNode) {
    const props = getFiberCurrentPropsFromNode(stateNode)

    restoreImpl(stateNode, type, item.value, props)
  }
}
