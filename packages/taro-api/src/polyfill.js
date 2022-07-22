import { isFunction, isObject, isUndefined } from './utils'

const isBadObj = (x) => !isObject(x)

function throwTypeError (s) {
  throw new TypeError(s)
}

if (!isFunction(Object.assign)) {
  // Must be writable: true, enumerable: false, configurable: true
  Object.assign = function (target) { // .length of function is 2
    if (target == null) { // TypeError if undefined or null
      throwTypeError('Cannot convert undefined or null to object')
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

if (!isFunction(Object.defineProperties)) {
  Object.defineProperties = function (obj, properties) {
    function convertToDescriptor (desc) {
      function hasProperty (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
      }

      if (isBadObj(desc)) { throwTypeError('bad desc') }

      const d = {}

      if (hasProperty(desc, 'enumerable')) d.enumerable = !!desc.enumerable
      if (hasProperty(desc, 'configurable')) { d.configurable = !!desc.configurable }
      if (hasProperty(desc, 'value')) d.value = desc.value
      if (hasProperty(desc, 'writable')) d.writable = !!desc.writable
      if (hasProperty(desc, 'get')) {
        const g = desc.get

        if (!isFunction(g) && !isUndefined(g)) { throwTypeError('bad get') }
        d.get = g
      }
      if (hasProperty(desc, 'set')) {
        const s = desc.set
        if (!isFunction(s) && !isUndefined(s)) { throwTypeError('bad set') }
        d.set = s
      }

      if (('get' in d || 'set' in d) && ('value' in d || 'writable' in d)) { throwTypeError('identity-confused descriptor') }

      return d
    }

    if (isBadObj(obj)) throwTypeError('bad obj')

    properties = Object(properties)

    const keys = Object.keys(properties)
    const descs = []

    for (let i = 0; i < keys.length; i++) {
      descs.push([keys[i], convertToDescriptor(properties[keys[i]])])
    }

    for (let i = 0; i < descs.length; i++) {
      Object.defineProperty(obj, descs[i][0], descs[i][1])
    }

    return obj
  }
}
