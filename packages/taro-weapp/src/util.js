import isPlainObject from 'lodash/isPlainObject'

export function isEmptyObject (obj) {
  if (!obj || !isPlainObject(obj)) {
    return false
  }
  for (const n in obj) {
    if (obj.hasOwnProperty(n)) {
      return false
    }
  }
  return true
}

/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone (jsonObj) {
  var buf
  if (jsonObj instanceof Array) {
    buf = []
    var i = jsonObj.length
    while (i--) {
      buf[i] = objClone(jsonObj[i])
    }
    return buf
  } else if (jsonObj instanceof Object) {
    buf = {}
    for (var k in jsonObj) {
      buf[k] = objClone(jsonObj[k])
    }
    return buf
  } else {
    return jsonObj
  }
}

export function getPrototype (obj) {
  /* eslint-disable */
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(obj)
  } else if (obj.__proto__) {
    return obj.__proto__
  }
  /* eslint-enable */
  return obj.constructor.prototype
}

export function getPrototypeChain (obj) {
  const protoChain = []
  while ((obj = getPrototype(obj))) {
    protoChain.push(obj)
  }
  return protoChain
}

export function noop () {}

export function isFunction (arg) {
  return typeof arg === 'function'
}

export function isArray (arg) {
  return Array.isArray(arg)
}

export function shakeFnFromObject (obj) {
  let newObj
  if (isArray(obj)) {
    newObj = []
    const len = obj.length
    for (let i = 0; i < len; i++) {
      newObj.push(shakeFnFromObject(obj[i]))
    }
  } else if (isPlainObject(obj)) {
    newObj = {}
    for (const key in obj) {
      if (isFunction(obj[key])) {
        continue
      }
      const ret = shakeFnFromObject(obj[key])
      newObj[key] = ret
    }
  } else {
    return obj
  }
  return newObj
}
