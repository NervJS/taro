import type { TaroElement } from '@tarojs/runtime'

function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function createEventOnName (eventName: string) {
  return `on${capitalize(eventName)}`
}

export function createEventTapName (eventName: string) {
  return `is${capitalize(eventName)}Tap`
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
