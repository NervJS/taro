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

function isDistanceUnit (value) {
  return isNumber(value) || (isString(value) && /^[+-]?\d*\.\d*(px)?$/i.test(value))
}

function parseDistanceUnit (value) {
  if (isNumber(value) || (isString(value) && /^[+-]?\d*\.\d*$/.test(value))) {
    return value + 'px'
  } else if (isString(value) && /^[+-]?\d*\.\d*px$/i.test(value)) {
    return value
  }
  return '0px'
}

export {
  isBoolean,
  isNumber,
  isString,
  isFunction,
  isDistanceUnit,
  parseDistanceUnit
}
