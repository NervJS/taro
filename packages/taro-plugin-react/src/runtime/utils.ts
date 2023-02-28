import { Current } from '@tarojs/runtime'
import { isArray, isFunction } from '@tarojs/shared'

import type * as React from 'react'

export const HOOKS_APP_ID = 'taro-app'

export function isClassComponent (R: typeof React, component): boolean {
  const prototype = component.prototype

  // For React Redux
  if (component.displayName?.includes('Connect')) return false

  return (
    isFunction(component.render) ||
    !!prototype?.isReactComponent ||
    prototype instanceof R.Component // compat for some others react-like library
  )
}

export function ensureIsArray<T> (item: T | T[]): T[] {
  if (isArray(item)) {
    return item
  } else {
    return item ? [item] : []
  }
}

/**
 * set writable, enumerable to true
 */
export function setDefaultDescriptor (obj: Record<string, any>) {
  obj.writable = true
  obj.enumerable = true
  return obj
}

/**
 * 设置入口的路由参数
 * @param options 小程序传入的参数
 */
export function setRouterParams (options) {
  Current.router = {
    params: options?.query,
    ...options
  }
}
