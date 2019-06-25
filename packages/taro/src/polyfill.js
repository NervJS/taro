if (typeof Object.assign !== 'function') {
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

if (typeof Object.defineProperties !== 'function') {
  Object.defineProperties = function (obj, properties) {
    function convertToDescriptor (desc) {
      function hasProperty (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
      }

      function isCallable (v) {
        // NB: modify as necessary if other values than functions are callable.
        return typeof v === 'function'
      }

      if (typeof desc !== 'object' || desc === null) { throw new TypeError('bad desc') }

      var d = {}

      if (hasProperty(desc, 'enumerable')) d.enumerable = !!desc.enumerable
      if (hasProperty(desc, 'configurable')) { d.configurable = !!desc.configurable }
      if (hasProperty(desc, 'value')) d.value = desc.value
      if (hasProperty(desc, 'writable')) d.writable = !!desc.writable
      if (hasProperty(desc, 'get')) {
        var g = desc.get

        if (!isCallable(g) && typeof g !== 'undefined') { throw new TypeError('bad get') }
        d.get = g
      }
      if (hasProperty(desc, 'set')) {
        var s = desc.set
        if (!isCallable(s) && typeof s !== 'undefined') { throw new TypeError('bad set') }
        d.set = s
      }

      if (('get' in d || 'set' in d) && ('value' in d || 'writable' in d)) { throw new TypeError('identity-confused descriptor') }

      return d
    }

    if (typeof obj !== 'object' || obj === null) throw new TypeError('bad obj')

    properties = Object(properties)

    var keys = Object.keys(properties)
    var descs = []

    for (var i = 0; i < keys.length; i++) {
      descs.push([keys[i], convertToDescriptor(properties[keys[i]])])
    }

    for (var i = 0; i < descs.length; i++) {
      Object.defineProperty(obj, descs[i][0], descs[i][1])
    }

    return obj
  }
}
