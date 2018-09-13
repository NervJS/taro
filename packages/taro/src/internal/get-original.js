function isObject (arg) {
  return arg === Object(arg) && typeof arg !== 'function'
}

export function getOriginal (item) {
  if (isObject(item)) {
    return item.$$original || item
  }
  return item
}
