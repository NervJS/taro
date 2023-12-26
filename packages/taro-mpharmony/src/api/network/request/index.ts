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

  const { url, success, fail, complete, method, ...otherOptions } = options as Exclude<typeof options, undefined>
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
    // @ts-ignore
    task = native.request({
      url,
      method: upperMethod,
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

/**
 * 发起 HTTPS 网络请求
 * 
 * @canUse request
 * @__object [url, data, header, timeout, method[OPTIONS, GET, HEAD, POST, PUT, PATCH, DELETE, TRACE, CONNECT], responseType[text, arraybuffer], enableCache]
 * @__success [data, header, statusCode, cookies]
 */
export function request (options) {
  const result = link.request.bind(link)(options)
  result.catch(() => {})
  return result
}

/**
 * 网络请求任务对象
 * 
 * @canUse RequestTask
 * @__class [abort, onHeadersReceived, offHeadersReceived]
 */

/**
 * 使用拦截器
 * 
 * @canNotUse addInterceptor
 */
export const addInterceptor = link.addInterceptor.bind(link)

/**
 * 清除所有拦截器
 * 
 * @canNotUse cleanInterceptors
 */
export const cleanInterceptors = link.cleanInterceptors.bind(link)
