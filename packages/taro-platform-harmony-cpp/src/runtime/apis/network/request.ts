import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler, validateParams } from '../utils'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

type TRequest = typeof Taro.request
const METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']

const scope = 'network'
const type = 'method'
const requestSchema = {
  url: 'String',
}
/**
 * 请求成功返回类型
 */
interface SuccessResponseType {
  status: number
  statusText: string
  data: TaroAny
  headers: TaroAny
}

interface FailResponseType extends Error {
  code: number
  customProps?: string
  errorType?: string
}

export const request: TRequest = (options) => {
  let task
  const requestTask: any = new Promise((resolve, reject) => {
    let { method = 'GET' } = options
    const {
      url,
      header = {},
      timeout = 60000,
      dataType = 'json',
      data,
      enableHttpDNS = false,
      success,
      fail,
      complete,
    } = options

    const handle = new MethodHandler<any>({ name: 'request', success, fail, complete })

    // ** 校验入参 **
    const isGetRequest = method.toUpperCase() === 'GET'
    if (!isGetRequest) {
      // -> 1.没有 content-type 的加上默认 application/json
      const keyOfContentType = Object.keys(header).find((item) => item.toLowerCase() === 'content-type')
      !keyOfContentType && (header['Content-Type'] = 'application/json')
    }

    // -> 2. 检查 method 是否正确
    if (METHOD.includes(method.toUpperCase())) {
      method = method.toUpperCase() as keyof Taro.request.Method
    } else {
      const error = {
        errMsg: `request fail parameter error: the method value should be one of the ${METHOD.join(',')}`,
      }
      handle.fail(error, { resolve, reject })
    }

    // -> 3. 校验send的数据类型
    try {
      validateParams('send', options, requestSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      handle.fail(res, { resolve, reject })
    }

    // ** 校验入参 **
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name: 'request',
      args: [
        {
          ...options,
          url,
          method: method.toUpperCase(),
          header,
          timeout,
          dataType,
          data: data as string,
          enableSuccessResponse: true,
          enableHttpDNS,
          success: (requestData: SuccessResponseType) => {
            const reswx = {
              data: requestData.data,
              statusCode: requestData.status,
              headers: requestData.headers,
            }
            handle.success(reswx, { resolve, reject })
          },
          fail: (data: FailResponseType) => {
            handle.fail(data, { resolve, reject })
          },
        },
      ],
      scope,
      type,
      onInit: (obj) => {
        task = obj
      },
    })
  })

  requestTask.abort = function () {
    task?.doCancel?.()
  }

  return requestTask
}
