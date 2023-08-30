import { FunctionType, IAsyncParams } from './types'

export * from './validate'

export function noop () {}

export function unsupport (str: string) {
  return function () {
    process.env.NODE_ENV !== 'production' && console.warn(`暂不支持 Taro.${str}`)
  }
}

export function temporarilyNotSupport (apiName: string, recommended?: string, isSync = true) {
  return () => {
    let errMsg = `暂不支持 API ${apiName}`
    if (recommended) {
      errMsg += `, 请使用 ${recommended}`
    }
    console.error(errMsg)
    const error = new Error(errMsg)

    if (!isSync) {
      return Promise.reject(error)
    } else {
      return error
    }
  }
}

export function callAsyncSuccess<T extends FunctionType> (resolve, res, options?: IAsyncParams<T>) {
  options?.success?.(res)
  options?.complete?.(res)
  resolve(res)
}

export function callAsyncFail<T extends FunctionType> (reject, res, options?: IAsyncParams<T>) {
  options?.fail?.(res)
  options?.complete?.(res)
  reject(res)
}
