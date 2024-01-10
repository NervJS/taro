import { isFunction, isObject, isUndefined } from '@tarojs/shared'

export function handleObjectAssignPolyfill () {
  if (!isFunction(Object.assign)) {
    // Must be writable: true, enumerable: false, configurable: true
    Object.assign = function (target) { // .length of function is 2
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object')
      }

      const to = Object(target)

      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]

        if (nextSource != null) { // Skip over if undefined or null
          for (const nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    }
  }
}

export function handleObjectEntriesPolyfill () {
  if (!isFunction(Object.entries)) {
    // Must be writable: true, enumerable: false, configurable: true
    Object.entries = function (obj) { // .length of function is 2
      if (obj == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object')
      }

      const to: [string, unknown][] = []

      if (obj != null) { // Skip over if undefined or null
        for (const key in obj) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            to.push([key, obj[key]])
          }
        }
      }
      return to
    }
  }
}

export function handleObjectDefinePropertyPolyfill () {
  if (!isFunction(Object.defineProperties)) {
    Object.defineProperties = function (obj, properties: Record<PropertyKey, Record<PropertyKey, unknown>>) {
      function convertToDescriptor (desc: Record<string, unknown>) {
        function hasProperty (obj, prop) {
          return Object.prototype.hasOwnProperty.call(obj, prop)
        }

        if (!isObject(desc)) { throw new TypeError('bad desc') }

        const d: Record<PropertyKey, unknown> = {}

        if (hasProperty(desc, 'enumerable')) d.enumerable = !!desc.enumerable
        if (hasProperty(desc, 'configurable')) { d.configurable = !!desc.configurable }
        if (hasProperty(desc, 'value')) d.value = desc.value
        if (hasProperty(desc, 'writable')) d.writable = !!desc.writable
        if (hasProperty(desc, 'get')) {
          const g = desc.get

          if (!isFunction(g) && !isUndefined(g)) { throw new TypeError('bad get') }
          d.get = g
        }
        if (hasProperty(desc, 'set')) {
          const s = desc.set
          if (!isFunction(s) && !isUndefined(s)) { throw new TypeError('bad set') }
          d.set = s
        }

        if (('get' in d || 'set' in d) && ('value' in d || 'writable' in d)) { throw new TypeError('identity-confused descriptor') }

        return d
      }

      if (!isObject(obj)) throw new TypeError('bad obj')

      properties = Object(properties)

      const keys = Object.keys(properties)
      const descs: [PropertyKey, Record<PropertyKey, unknown>][] = []

      for (let i = 0; i < keys.length; i++) {
        descs.push([keys[i], convertToDescriptor(properties[keys[i]])])
      }

      for (let i = 0; i < descs.length; i++) {
        Object.defineProperty(obj, descs[i][0], descs[i][1])
      }

      return obj
    }
  }
}
