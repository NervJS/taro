export const EMPTY_OBJ: any = {}

export const EMPTY_ARR = []

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

export function toDashed (s: string) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function toCamelCase (s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export function capitalize (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (
  val: object,
  key: string | symbol
) => hasOwnProperty.call(val, key)

const reportIssue = '如有疑问，请提交 issue 至：https://github.com/nervjs/taro/issues'

/**
 * ensure takes a condition and throw a error if the condition fails,
 * like failure::ensure: https://docs.rs/failure/0.1.1/failure/macro.ensure.html
 * @param condition condition.
 * @param msg error message.
 */
export function ensure (condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg + '\n' + reportIssue)
  }
}

export function warn (condition: boolean, msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (condition) {
      console.warn(msg)
    }
  }
}
