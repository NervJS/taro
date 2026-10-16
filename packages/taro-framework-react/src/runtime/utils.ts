import { Current, document, isElement } from '@tarojs/runtime'
import { isArray, isFunction } from '@tarojs/shared'

import type { TaroElement } from '@tarojs/runtime'
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

/** Shared containers remain independent; only physical #app.children exposes their roots. */
export function exposeSharedAppChildren (container: TaroElement) {
  const app = document.getElementById('app') as (TaroElement & {
    __taroSharedContainers?: Set<TaroElement>
  }) | null
  if (!app || app === container) return

  if (!app.__taroSharedContainers) {
    const containers = new Set<TaroElement>()
    Object.defineProperty(app, '__taroSharedContainers', { value: containers })
    Object.defineProperty(app, 'children', {
      configurable: true,
      get () {
        const children = app.childNodes.filter(isElement).filter(node => !containers.has(node))
        // Ordinary Page containers may be siblings of #app or detached; never move them.
        containers.forEach(item => children.push(...item.children))
        let index = Current.page
          ? children.findIndex(node => node.nodeName === 'root' && node.ctx === Current.page)
          : -1
        if (index < 0 && Current.router?.$taroPath) {
          index = children.findIndex(node => node.nodeName === 'root' && node.id === Current.router!.$taroPath)
        }
        // Existing business queries use the last root when no explicit page is supplied.
        if (index >= 0) children.push(children.splice(index, 1)[0])
        return children
      }
    })
  }
  app.__taroSharedContainers!.add(container)
}
