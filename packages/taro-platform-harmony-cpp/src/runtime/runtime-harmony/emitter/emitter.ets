import { TaroNativeModule } from '../harmony-library'

import type { TaroAny } from '@tarojs/runtime'

class Events {
  on = (...args: TaroAny[]) => {
    if (!args[0]) {
      console.error(`TaroEvent: event type is not correct\n${new Error().stack}`)
      return this
    }
    TaroNativeModule.onEventCenter(...args)
    return this
  }

  once = (...args: TaroAny[]) => {
    if (!args[0]) {
      console.error(`TaroEvent: event type is not correct\n${new Error().stack}`)
      return this
    }
    TaroNativeModule.onEventCenterOnce(...args)
    return this
  }

  off = (...args: TaroAny[]) => {
    if (!args[0]) {
      console.error(`TaroEvent: event type is not correct\n${new Error().stack}`)
      return this
    }
    TaroNativeModule.offEventCenter(...args)
    return this
  }

  trigger = (type: string, ...args: TaroAny[]) => {
    if (!type) {
      console.error(`TaroEvent: trigger event type is not correct\n${new Error().stack}`)
      return this
    }
    TaroNativeModule.triggerEventCenter(type, args)
    return this
  }
}

export const eventCenter = new Events()
