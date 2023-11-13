import { isFunction } from '@tarojs/shared'

import type { TaroElement } from '../dom/element'

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

  const id = node._nid
  const component = node._instance

  try {
    component.nodeInfoMap[id].eventMap[createEventTapName(eventName)] = false
  } catch (e) {
    console.warn(`disconnectEvent ${eventName} error: `, e)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getComponentEventCallback (node: TaroElement, eventName: string, callback: Function) {
  if (!node || !node?._instance) return null

  const id = node._nid
  const component = node?._instance

  if (component?.nodeInfoMap?.[id]?.eventMap?.[createEventTapName(eventName)]) {
    return (...eventResult: any[]) => {
      if (!component?.nodeInfoMap?.[id]?.eventMap?.[createEventTapName(eventName)]) return

      const res = {
        component,
        eventResult
      }

      callback && callback.call(component, res)

      component?.node?.[createEventOnName(eventName)]?.(res)
    }
  }

  return null
}

// eslint-disable-next-line @typescript-eslint/ban-types
function tapCallbackToNodeAndUpdate (node: TaroElement, eventName: string, callback: Function) {
  const id = node._nid

  node._instance.nodeInfoMap[id].eventMap[createEventTapName(eventName)] = true
  node[createEventOnName(eventName)] = ({ eventResult }) => {
    callback && callback(...eventResult)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function setNodeEventCallbackAndTriggerComponentUpdate (node: TaroElement, eventName: string, callback: Function, isAsync = false) {
  const id = node._nid
  const instance = node._instance

  if (isAsync) {
    // 阻塞函数执行，等待监听节点绑定上的回调函数
    if (!instance.nodeInfoMap[id].eventMap[createEventTapName(eventName)]) {
      let onEventPromiseResolve
      const eventPromise = new Promise(resolve => {
        onEventPromiseResolve = resolve
      })

      instance.nodeInfoMap[id].promiseMap[eventName] = eventPromise
      tapCallbackToNodeAndUpdate(node, eventName, (...eventResult) => {
        callback && callback(...eventResult)

        onEventPromiseResolve()
      })
    }

    await instance.nodeInfoMap[id].promiseMap[eventName]
  } else {
    tapCallbackToNodeAndUpdate(node, eventName, callback)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function bindAttributesCallback (node: TaroElement, attributeName: string, callback: Function) {
  if (!node) return

  const id = node._nid
  const component = node._instance

  component.nodeInfoMap[id].attributeCallback[attributeName] = callback
}

export function triggerAttributesCallback (node, attributeName, isAfterNodeMounted?) {
  if (!node) return

  const id = node._nid
  const value = node._attrs[attributeName]
  const triggerFn = () => {
    const component = node._instance
    const cb = component.nodeInfoMap[id].attributeCallback[attributeName]
    
    isFunction(cb) && cb(value)
  }

  if (isAfterNodeMounted) {
    node.awaitAppear.then(triggerFn)
  } else {
    triggerFn()
  }
}
