export const isArray = Array.isArray

export const EMPTY_OBJ: any = {}

export const EMPTY_ARR = {}

export function isString (o: unknown): o is string {
  return typeof o === 'string'
}

export function isUndefined (o: unknown): o is undefined {
  return typeof o === 'undefined'
}

export function isNull (o: unknown): o is null {
  return o === null
}

export function isObject<T> (o: unknown): o is T {
  return o !== null && typeof o === 'object'
}

export function isBoolean (o: unknown): o is boolean {
  return o === true || o === false
}

export function isFunction (o: unknown): o is Function {
  return typeof o === 'function'
}

export const noop = (..._: unknown[]) => {}

/**
 * Boxed value.
 *
 * @typeparam T Value type.
 */
export interface Box<T> {
  v: T;
}

/**
 * box creates a boxed value.
 *
 * @typeparam T Value type.
 * @param v Value.
 * @returns Boxed value.
 */
export const box = <T>(v: T) => ({ v })

/**
 * box creates a boxed value.
 *
 * @typeparam T Value type.
 * @param b Boxed value.
 * @returns Value.
 */
export const unbox = <T>(b: Box<T>) => b.v
