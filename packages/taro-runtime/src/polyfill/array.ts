import { isFunction } from '@tarojs/shared'

export function handleArrayFindPolyfill () {
  if (!isFunction(Array.prototype.find)) {
    Object.defineProperty(Array.prototype, 'find', {
      value (predicate) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined')
        }
        const o = Object(this)
        const len = o.length >>> 0
        if (!isFunction(predicate)) {
          throw new TypeError('predicate must be a function')
        }
        const thisArg = arguments[1]
        let k = 0
        while (k < len) {
          const kValue = o[k]
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue
          }
          k++
        }
        return undefined
      }
    })
  }
}

export function handleArrayIncludesPolyfill () {
  if (!isFunction(Array.prototype.includes)) {
    Object.defineProperty(Array.prototype, 'includes', {
      value (searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined')
        }
        const o = Object(this)
        const len = o.length >>> 0
        if (len === 0) {
          return false
        }
        const n = fromIndex | 0
        let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)
        while (k < len) {
          if (o[k] === searchElement) {
            return true
          }
          k++
        }
        return false
      }
    })
  }
}
