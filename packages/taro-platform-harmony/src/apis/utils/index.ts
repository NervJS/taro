import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'

import { ICallbackResult, MethodHandler } from './handler'

import type { FunctionType, IAsyncParams } from './types'

export * from './validate'

export function noop () {}

export function unsupport (str: string) {
  return function () {
    process.env.NODE_ENV !== 'production' && console.warn(`暂不支持 Taro.${str}`)
  }
}

export function object2String (obj) {
  let str = ''
  for (const item in obj) {
    str = str + item + ':' + obj[item] + ' \n'
  }
  return str
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

export function permanentlyNotSupport (name = '') {
  return (option = {}, ...args: any[]) => {
    const { success, fail, complete } = option as any
    const handle = new MethodHandler<ICallbackResult>({ name, success, fail, complete })
    const errMsg = '不支持 API'
    eventCenter.trigger('__taroNotSupport', {
      name,
      args: [option, ...args],
      type: 'method',
      category: 'permanently',
    })
    if (process.env.NODE_ENV === 'production') {
      console.warn(errMsg)
      return handle.success({ errMsg })
    } else {
      return handle.fail({ errMsg })
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