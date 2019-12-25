export function isEmptyObject (obj) {
  if (!obj) {
    return false
  }
  for (const n in obj) {
    if (obj.hasOwnProperty(n) && obj[n]) {
      return false
    }
  }
  return true
}

// Object.is polyfill
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
export function objectIs (x, y) {
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y
  }
  // eslint-disable-next-line no-self-compare
  return x !== x && y !== y
}

export function isFunction (arg) {
  return typeof arg === 'function'
}

export const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout

export function isUndefined (o) {
  return o === undefined
}

export function isArray (arg) {
  return Array.isArray(arg)
}

export function isNullOrUndef (o) {
  return isUndefined(o) || o === null
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

let isUsingDiff = true

export function getIsUsingDiff () {
  return isUsingDiff
}

export function setIsUsingDiff (flag) {
  isUsingDiff = Boolean(flag)
}
