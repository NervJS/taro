/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
