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
