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
