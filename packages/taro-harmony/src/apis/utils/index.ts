export * from './validate'

interface Current {
  taro: Record<string, any>
}

export const current: Current = {
  taro: {}
}

export function noop () {}

export function unsupport (str: string) {
  return function () {
    process.env.NODE_ENV !== 'production' && console.warn(`暂不支持 Taro.${str}`)
  }
}

export function callAsyncSuccess (resolve, res, options) {
  options?.success?.(res)
  options?.complete?.(res)
  resolve(res)
}

export function callAsyncFail (reject, res, options) {
  options?.fail?.(res)
  options?.complete?.(res)
  reject(res)
}
