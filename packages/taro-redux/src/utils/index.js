export function isObject (arg) {
  return arg != null && typeof arg === 'object' && !Array.isArray(arg)
}

export function mergeObjects (obj1, obj2) {
  const result = Object.assign({}, obj1)
  if (isObject(obj1) && isObject(obj2)) {
    for (const p in obj2) {
      if (isObject(obj1[p]) && isObject(obj2[p])) {
        result[p] = mergeObjects(obj1[p], obj2[p])
      } else {
        result[p] = obj2[p]
      }
    }
  }
  return result
}
