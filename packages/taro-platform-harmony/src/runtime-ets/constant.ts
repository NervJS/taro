import { isNumber } from '@tarojs/shared'

export * from '@tarojs/runtime/dist/constants'

export const ATTRIBUTES_CALLBACK_TRIGGER_MAP = {
  scrollTop: {
    triggerName: 'scrollTo',
    valueInspect: (value) => isNumber(value),
  },
  scrollLeft: {
    triggerName: 'scrollTo',
    valueInspect: (value) => isNumber(value),
  },
  focus: {
    triggerName: 'focus',
  },
  animation: {
    triggerName: 'animation',
  }
}
