import Taro from '@tarojs/api'
import { isFunction } from '@tarojs/shared'
import { getParameterError, shouldBeObject } from 'src/utils'

export const _request = (options) => {
  const name = 'request'

  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { url, success, fail, complete, ...otherOptions } = options as Exclude<typeof options, undefined>
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
    // @ts-ignore
    task = native.request({
      url,
      ...otherOptions,
      success: (res: any) => {
        isFunction(success) && success(res)
        isFunction(complete) && complete(res)
        resolve(res)
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

export const request: typeof Taro.request = link.request.bind(link)
export const addInterceptor = link.addInterceptor.bind(link)
export const cleanInterceptors = link.cleanInterceptors.bind(link)
