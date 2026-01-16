import { isFunction } from '@tarojs/shared'

import type { TaroElement } from '../dom/element/element'

export const AREA_CHANGE_EVENT_NAME = 'areaChange'
export const VISIBLE_CHANGE_EVENT_NAME = 'visibleChange'

function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function createEventOnName (eventName: string) {
  return `on${capitalize(eventName)}`
}

export function createEventTapName (eventName: string) {
  return `is${capitalize(eventName)}Tap`
}

export const disconnectEvent = (node: TaroElement, eventName: string) => {
  if (!node) return null

  try {
    node._nodeInfo.eventMap[createEventTapName(eventName)] = false
  } catch (e) {
    console.warn(`disconnectEvent ${eventName} error: `, e)
  }
}

export function getComponentEventCallback (node: TaroElement, eventName: string, callback?: (data: any) => void) {
  if (!node) return null

  if (node._nodeInfo?.eventMap?.[createEventTapName(eventName)]) {
    return (...eventResult: any[]) => {
      if (!node._nodeInfo?.eventMap?.[createEventTapName(eventName)]) return

      callback && callback(eventResult)

      node?.[createEventOnName(eventName)]?.(eventResult)
    }
  }

  return null
}

// eslint-disable-next-line @typescript-eslint/ban-types
function tapCallbackToNodeAndUpdate (node: TaroElement, eventName: string, callback: Function) {
  node._nodeInfo.eventMap[createEventTapName(eventName)] = true
  node[createEventOnName(eventName)] = (eventResult) => {
    callback && callback(...eventResult)
  }

  if (!node._isDynamicNode && node._isCompileMode) {
    node.updateComponent()
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function setNodeEventCallbackAndTriggerComponentUpdate (node: TaroElement, eventName: string, callback: Function, isAsync = false) {
  if (isAsync) {
    // 阻塞函数执行，等待监听节点绑定上的回调函数
    if (!node._nodeInfo.eventMap[createEventTapName(eventName)]) {
      let onEventPromiseResolve
      const eventPromise = new Promise(resolve => {
        onEventPromiseResolve = resolve
      })

      node._nodeInfo.promiseMap[eventName] = eventPromise
      tapCallbackToNodeAndUpdate(node, eventName, (...eventResult) => {
        callback && callback(...eventResult)

        onEventPromiseResolve()
      })
    }

    await node._nodeInfo.promiseMap[eventName]
  } else {
    tapCallbackToNodeAndUpdate(node, eventName, callback)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function bindAttributesCallback (node: TaroElement, _: string, callback: Function) {
  if (!node) return

  node._nodeInfo = callback
}

export function triggerAttributesCallback (node, attributeName) {
  if (!node) return

  const value = node._attrs[attributeName]
  const cb = node._nodeInfo.attributeCallback[attributeName]

  isFunction(cb) && cb(value)
}

export function initComponentNodeInfo (node: TaroElement) {
  node._nodeInfo.eventMap = {}
  node._nodeInfo.promiseMap = {}
  node._nodeInfo.attributeCallback = {}
}
