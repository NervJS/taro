export function isFunction (x) {
  return typeof x === 'function'
}

export function isUndefined (x) {
  return typeof x === 'undefined'
}

export function isObject (x) {
  return x && typeof x === 'object'
}
