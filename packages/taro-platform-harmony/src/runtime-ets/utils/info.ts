import type { TaroElement } from '../dom/element'

function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function createEventOnName (eventName: string) {
  return `on${capitalize(eventName)}`
}

export function createEventTapName (eventName: string) {
  return `is${capitalize(eventName)}Tap`
}

export const AREA_CHANGE_EVENT_NAME = 'areaChange'
export const AREA_CHANGE_TAP_NAME = createEventTapName(AREA_CHANGE_EVENT_NAME)

export const VISIBLE_CHANGE_EVENT_NAME = 'visibleChange'
export const VISIBLE_CHANGE_TAP_NAME = createEventTapName(VISIBLE_CHANGE_EVENT_NAME)

// eslint-disable-next-line @typescript-eslint/ban-types
export function getComponentEventCallback (eventName: string, component: any, callback: Function) {
  const node = component?.node

  if (!node) return null

  const id = node._nid
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

  // @ts-ignore
  node._updateTrigger += 1
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function setNodeEventCallbackAndTriggerComponentUpdate (node: TaroElement, eventName: string, callback: Function, isAsync = false) {
  const id = node._nid
  const instance = node._instance

  if (isAsync) {
    // 阻塞函数执行，等待监听节点绑定上的回调函数
    if (!instance.nodeInfoMap[id].eventMap[AREA_CHANGE_TAP_NAME]) {
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
