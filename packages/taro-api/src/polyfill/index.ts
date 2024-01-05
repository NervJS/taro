import { isObject } from '@tarojs/shared'

import { handleIntersectionObserverPolyfill } from './intersection-observer'
import { handleObjectAssignPolyfill, handleObjectDefinePropertyPolyfill } from './object'

if (process.env.SUPPORT_TARO_POLYFILL !== 'disabled') {
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Object' || process.env.SUPPORT_TARO_POLYFILL === 'Object.assign') {
    handleObjectAssignPolyfill()
  }
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Object' || process.env.SUPPORT_TARO_POLYFILL === 'Object.defineProperty') {
    handleObjectDefinePropertyPolyfill()
  }
  // Exit early if we're not running in a browser.
  if (process.env.TARO_PLATFORM === 'web' && isObject(window)) {
    if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'IntersectionObserver') {
      handleIntersectionObserverPolyfill()
    }
  }
}
