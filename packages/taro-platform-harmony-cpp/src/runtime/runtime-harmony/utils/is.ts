function isString(o) {
  return typeof o === 'string'
}
function isUndefined(o) {
  return typeof o === 'undefined'
}
function isNull(o) {
  return o === null
}
function isObject(o) {
  return o !== null && typeof o === 'object'
}
function isBoolean(o) {
  return o === true || o === false
}
function isFunction(o) {
  return typeof o === 'function'
}
function isNumber(o) {
  if (Number.isFinite) {
    return Number.isFinite(o)
  }
  return typeof o === 'number'
}
function isBooleanStringLiteral(o) {
  return o === 'true' || o === 'false'
}
function isObjectStringLiteral(o) {
  return o === '{}'
}
const isArray = Array.isArray

export { isArray, isBoolean, isBooleanStringLiteral, isFunction, isNull, isNumber, isObject, isObjectStringLiteral, isString, isUndefined }
