import { isArray } from './is'

export * from './is'
export { noop } from '@tarojs/shared'

export function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const incrementId = (init = 0) => {
  let n = init
  return () => n++
}

export function ensureIsArray<T> (item: T | T[]): T[] {
  if (isArray(item)) {
    return item
  } else {
    return item ? [item] : []
  }
}

export const EMPTY_OBJ: any = {}

export const HOOKS_APP_ID = 'taro-app'
