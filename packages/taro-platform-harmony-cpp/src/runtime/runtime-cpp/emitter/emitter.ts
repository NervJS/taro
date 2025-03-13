import { Events } from '@tarojs/shared'

import type { TaroAny } from '../interface'

class TaroNativeEvents {
  on = (...args: TaroAny[]) => {
    if (!args[0]) {
      console.error(`TaroEvent: event type is not correct\n${new Error().stack}`)
      return this
    }
    nativeEvent.onEventCenter(...args)
    return this
  }

  once = (...args: TaroAny[]) => {
    if (!args[0]) {
      console.error(`TaroEvent: event type is not correct\n${new Error().stack}`)
      return this
    }
    nativeEvent.onEventCenterOnce(...args)
    return this
  }

  off = (...args: TaroAny[]) => {
    if (!args[0]) {
      console.error(`TaroEvent: event type is not correct\n${new Error().stack}`)
      return this
    }
    nativeEvent.offEventCenter(...args)
    return this
  }

  trigger = (type: string, ...args: TaroAny[]) => {
    if (!type) {
      console.error(`TaroEvent: trigger event type is not correct\n${new Error().stack}`)
      return this
    }
    nativeEvent.triggerEventCenter(type, args)
    return this
  }
}

const eventCenter = new TaroNativeEvents()

export type EventsType = typeof Events
export { eventCenter, Events }
