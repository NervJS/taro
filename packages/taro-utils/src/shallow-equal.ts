/**
 * Object.is() polyfill
 * here: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
const objectIs = function (x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y
  }
  return x !== x && y !== y
}

export default function shallowEqual (obj1: any, obj2: any): boolean {
  if (objectIs(obj1, obj2)) {
    return true
  }

  if (typeof obj1 !== 'object' || obj1 === null ||  typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  for (let i = 0; i < obj1Keys.length; i++) {
    const obj1KeyItem = obj1Keys[i]
    if (!obj2.hasOwnProperty(obj1KeyItem) || !objectIs(obj1[obj1KeyItem], obj2[obj1KeyItem])) {
      return false
    }
  }

  return true
}
