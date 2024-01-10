import { isObject } from '@tarojs/shared'

import { handleArrayFindPolyfill, handleArrayIncludesPolyfill } from './array'
import { handleIntersectionObserverPolyfill } from './intersection-observer'
import { handleObjectAssignPolyfill, handleObjectDefinePropertyPolyfill, handleObjectEntriesPolyfill } from './object'

function handlePolyfill () {
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Object' || process.env.SUPPORT_TARO_POLYFILL === 'Object.assign') {
    handleObjectAssignPolyfill()
  }
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Object' || process.env.SUPPORT_TARO_POLYFILL === 'Object.entries') {
    handleObjectEntriesPolyfill()
  }
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Object' || process.env.SUPPORT_TARO_POLYFILL === 'Object.defineProperty') {
    handleObjectDefinePropertyPolyfill()
  }
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Array' || process.env.SUPPORT_TARO_POLYFILL === 'Array.find') {
    handleArrayFindPolyfill()
  }
  if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'Array' || process.env.SUPPORT_TARO_POLYFILL === 'Array.includes') {
    handleArrayIncludesPolyfill()
  }
  // Exit early if we're not running in a browser.
  if (process.env.TARO_PLATFORM === 'web' && isObject(window)) {
    if (process.env.SUPPORT_TARO_POLYFILL === 'enabled' || process.env.SUPPORT_TARO_POLYFILL === 'IntersectionObserver') {
      handleIntersectionObserverPolyfill()
    }
  }
}

if (process.env.SUPPORT_TARO_POLYFILL !== 'disabled' && process.env.TARO_PLATFORM !== 'web') {
  handlePolyfill()
}

export { handlePolyfill }

