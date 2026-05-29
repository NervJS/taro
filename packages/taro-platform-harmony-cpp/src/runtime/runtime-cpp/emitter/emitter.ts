import { hooks } from '@tarojs/runtime/dist/runtime.esm'

import { TaroNativeModule } from '../harmony-library'

class Events {
  on = (...args) => {
    TaroNativeModule.onEventCenter(...args)
    return this
  }

  once = (...args) => {
    TaroNativeModule.onEventCenterOnce(...args)
    return this
  }

  off = (...args) => {
    TaroNativeModule.offEventCenter(...args)
    return this
  }

  trigger = (type, ...args) => {
    TaroNativeModule.triggerEventCenter(type, args)
    return this
  }
}

export const eventCenter = hooks.call('getEventCenter', Events as any) as Events

export { Events, EventsType } from '@tarojs/runtime/dist/runtime.esm'
