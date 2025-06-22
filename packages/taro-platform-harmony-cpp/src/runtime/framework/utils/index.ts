import { isArray } from './is'

export * from './is'
export { capitalize, noop } from '@tarojs/shared'

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
