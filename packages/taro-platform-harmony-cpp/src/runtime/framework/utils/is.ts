import { isFunction } from '@tarojs/shared'

export function isClassComponent (R, component) {
  const prototype = component.prototype

  // For React Redux
  if (component.displayName?.includes('Connect')) return false

  return (
    isFunction(component.render) ||
    !!prototype?.isReactComponent ||
    prototype instanceof R.Component // compat for some others react-like library
  )
}

export {
  isArray,
  isBoolean,
  isBooleanStringLiteral,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '@tarojs/shared'
