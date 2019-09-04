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
