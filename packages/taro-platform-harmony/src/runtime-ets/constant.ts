import { isNumber } from '@tarojs/shared'

export const TYPE = 'type'
export const VALUE = 'value'
export const INPUT = 'input'
export const CHANGE = 'change'
export const TARGET = 'target'
export const CONFIRM = 'confirm'
export const KEY_CODE = 'keyCode'
export const TIME_STAMP = 'timeStamp'
export const CURRENT_TARGET = 'currentTarget'
export const ID = 'id'

export const ATTRIBUTES_CALLBACK_TRIGGER_MAP = {
  scrollTop: {
    triggerName: 'scrollTo',
    valueInspect: (value) => isNumber(value)
  },
  scrollLeft: {
    triggerName: 'scrollTo',
    valueInspect: (value) => isNumber(value)
  },
  focus: {
    triggerName: 'focus',
  },
  animation: {
    triggerName: 'animation',
    isAfterNodeMounted: true
  }
}
