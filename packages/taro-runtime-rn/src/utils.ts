// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const incrementId = () => {
  let id = 0
  return () => (id++).toString()
}
export function isFunction (o: unknown): boolean {
  return typeof o === 'function'
}

export const EMPTY_OBJ: any = {}

export const isArray = Array.isArray
