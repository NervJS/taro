import { Current } from '@tarojs/runtime'
import { isArray } from '@tarojs/shared'

export * from './is'

export const noop = (..._: unknown[]) => {}

export function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const incrementId = () => {
  let n = 0
  return () => (n++).toString()
}

export const EMPTY_OBJ: any = {}

export const HOOKS_APP_ID = 'taro-app'

export function ensureIsArray<T>(item: T | T[]): T[] {
  if (isArray(item)) {
    return item
  } else {
    return item ? [item] : []
  }
}

/**
 * set writable, enumerable to true
 */
export function setDefaultDescriptor(obj: Record<string, any>) {
  obj.writable = true
  obj.enumerable = true
  return obj
}

/**
 * 设置入口的路由参数
 * @param options 小程序传入的参数
 */
export function setRouterParams(options) {
  Current.router = {
    params: options?.query,
    ...options,
  }
}


