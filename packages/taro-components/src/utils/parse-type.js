/** lodash BOF */
const objectProto = Object.prototype
const hasOwnProperty = objectProto.hasOwnProperty
const toString = objectProto.toString
const symToStringTag =
  typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined
/** `Object#toString` result references. */
const dataViewTag = '[object DataView]'
const mapTag = '[object Map]'
const objectTag = '[object Object]'
const promiseTag = '[object Promise]'
const setTag = '[object Set]'
const weakMapTag = '[object WeakMap]'

/** Used to detect maps, sets, and weakmaps. */
const dataViewCtorString = `${DataView}`
const mapCtorString = `${Map}`
const promiseCtorString = `${Promise}`
const setCtorString = `${Set}`
const weakMapCtorString = `${WeakMap}`

let getTag = baseGetTag

if (
  (DataView && getTag(new DataView(new ArrayBuffer(1))) !== dataViewTag) ||
  getTag(new Map()) !== mapTag ||
  getTag(Promise.resolve()) !== promiseTag ||
  getTag(new Set()) !== setTag ||
  getTag(new WeakMap()) !== weakMapTag
) {
  getTag = value => {
    const result = baseGetTag(value)
    const Ctor = result === objectTag ? value.constructor : undefined
    const ctorString = Ctor ? `${Ctor}` : ''

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag
        case mapCtorString:
          return mapTag
        case promiseCtorString:
          return promiseTag
        case setCtorString:
          return setTag
        case weakMapCtorString:
          return weakMapTag
      }
    }
    return result
  }
}

function isObjectLike (value) {
  return typeof value === 'object' && value !== null
}

function baseGetTag (value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value)
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag)
  const tag = value[symToStringTag]
  let unmasked = false
  try {
    value[symToStringTag] = undefined
    unmasked = true
  } catch (e) {}

  const result = toString.call(value)
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag
    } else {
      delete value[symToStringTag]
    }
  }
  return result
}

function isBoolean (value) {
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && baseGetTag(value) === '[object Boolean]')
  )
}

function isNumber (value) {
  return (
    typeof value === 'number' ||
    (isObjectLike(value) && baseGetTag(value) === '[object Number]')
  )
}

function isString (value) {
  const type = typeof value
  return (
    type === 'string' ||
    (type === 'object' &&
      value != null &&
      !Array.isArray(value) &&
      getTag(value) === '[object String]')
  )
}

function isObject (value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function isFunction (value) {
  if (!isObject(value)) {
    return false
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  const tag = baseGetTag(value)
  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object Proxy]'
  )
}

/** lodash  EOF */

export {
  isBoolean,
  isNumber,
  isString,
  isFunction
}
