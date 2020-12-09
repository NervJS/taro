// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import { OptionsFunc, CallbackResult } from './types/index'

export const incrementId = () => {
  let id = 0
  return () => (id++).toString()
}
export function isFunction (o: unknown): boolean {
  return typeof o === 'function'
}

export const EMPTY_OBJ: any = {}

export const isArray = Array.isArray

export function successHandler (success: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    success && isFunction(success) && success(res)
    complete && isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    fail && isFunction(fail) && fail(res)
    complete && isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}
