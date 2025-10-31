import { isNumber } from '@tarojs/shared'

export {
  A, APP, BEHAVIORS, BODY,
  CATCH_VIEW, CATCHMOVE, CHANGE,
  CLASS, COMMENT, COMPILE_MODE,
  CONFIRM, CONTAINER, CONTEXT_ACTIONS,
  CURRENT_TARGET, CUSTOM_WRAPPER,
  DATASET, DATE, DOCUMENT_ELEMENT_NAME,
  DOCUMENT_FRAGMENT, EVENT_CALLBACK_RESULT,
  EXTERNAL_CLASSES, FOCUS, HEAD,
  HOOKS_APP_ID, HTML, ID, INPUT,
  KEY_CODE, OBJECT, ON_HIDE, ON_LOAD,
  ON_READY, ON_SHOW, OPTIONS, PAGE_INIT,
  PROPERTY_THRESHOLD, PROPS, PURE_VIEW, ROOT_STR,
  SET_DATA, SET_TIMEOUT, STATIC_VIEW, STYLE,
  TARGET, TARO_RUNTIME, TIME_STAMP,
  TOUCHMOVE, TYPE, UID, VALUE, VIEW
} from '@tarojs/runtime/dist/runtime.esm'

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
