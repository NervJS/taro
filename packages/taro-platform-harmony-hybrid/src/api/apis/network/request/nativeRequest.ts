import Taro from '@tarojs/api'
import { isFunction } from '@tarojs/shared'
import { toByteArray } from 'base64-js'

import { NativeRequest } from '../../interface/NativeRequest'
import { getParameterError, shouldBeObject } from '../../utils'

export const _request = (options) => {
  const name = 'request'

  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { url, success, fail, complete, method, dataType, ...otherOptions } = options as Exclude<typeof options, undefined>
  if (typeof url !== 'string') {
    const res = {
      errMsg: getParameterError({
        para: 'url',
        correct: 'string',
        wrong: url,
      }),
    }
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }

  let task!: Taro.RequestTask<any>
  const result: ReturnType<typeof Taro.request> = new Promise((resolve, reject) => {
    const upperMethod = method ? method.toUpperCase() : method
    task = NativeRequest.createRequestTask({
      url,
      method: upperMethod,
      dataType,
      ...otherOptions,
      success: (res: any) => {
        const result = {
          data: res.data,
          statusCode: res.statusCode,
          header: res.header,
          cookies: res.cookies,
          errMsg: res.errMsg
        }
        // 如果请求的是二进制数据，则将返回值转换成 ArrayBuffer
        if (res.isArrayBuffer && dataType === 'arraybuffer') {
          result.data = toByteArray(res.data).buffer
        }
        isFunction(success) && success(result)
        isFunction(complete) && complete(result)
        resolve(result)
      },
      fail: (res: any) => {
        isFunction(fail) && fail(res)
        isFunction(complete) && complete(res)
        reject(res)
      },
    })
  }) as any

  result.onHeadersReceived = task.onHeadersReceived.bind(task)
  result.offHeadersReceived = task.offHeadersReceived.bind(task)
  result.abort = task.abort.bind(task)
  return result
}

function taroInterceptor (chain) {
  return _request(chain.requestParams)
}

// @ts-ignore
const { Link } = Taro
const link = new Link(taroInterceptor)


export function request (options) {
  const result = link.request.bind(link)(options)
  result.catch(() => {})
  return result
}


export const addInterceptor = link.addInterceptor.bind(link)


export const cleanInterceptors = link.cleanInterceptors.bind(link)
