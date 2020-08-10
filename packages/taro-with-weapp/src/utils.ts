/**
 * Simple bind, faster than native
 */
export function bind (fn /*: Function */, ctx /*: Object */) /*: Function */ {
  if (!fn) return false

  function boundFn (a) {
    const l /*: number */ = arguments.length
    return l ? (l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a)) : fn.call(ctx)
  }

  // record original fn length
  boundFn._length = fn.length
  return boundFn
}

export function isEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function noop (..._: unknown[]) {
  //
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function safeGet (obj, propsArg, defaultValue?) {
  if (!obj) {
    return defaultValue
  }
  let props, prop
  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0)
  }
  if (typeof propsArg == 'string') {
    props = propsArg.split('.')
  }
  if (typeof propsArg == 'symbol') {
    props = [propsArg]
  }
  if (!Array.isArray(props)) {
    throw new Error('props arg must be an array, a string or a symbol')
  }
  while (props.length) {
    prop = props.shift()
    if (!obj) {
      return defaultValue
    }
    obj = obj[prop]
    if (obj === undefined) {
      return defaultValue
    }
  }
  return obj
}

export function safeSet (obj, props, value) {
  if (typeof props == 'string') {
    props = props.split('.')
  }
  if (typeof props == 'symbol') {
    props = [props]
  }
  const lastProp = props.pop()
  if (!lastProp) {
    return false
  }
  let thisProp
  while ((thisProp = props.shift())) {
    if (typeof obj[thisProp] == 'undefined') {
      obj[thisProp] = {}
    }
    obj = obj[thisProp]
    if (!obj || typeof obj != 'object') {
      return false
    }
  }
  obj[lastProp] = value
  return true
}
