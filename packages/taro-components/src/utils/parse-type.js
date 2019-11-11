function isBoolean (value) {
  return typeof value === 'boolean'
}

function isNumber (value) {
  return typeof value === 'number'
}

function isString (value) {
  return typeof value === 'string'
}

function isFunction (value) {
  return typeof value === 'function'
}

export {
  isBoolean,
  isNumber,
  isString,
  isFunction
}
