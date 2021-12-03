// ✅ wx.request
// ✅ RequestTask.abort
// ✅ RequestTask.offHeadersReceived
// ✅ RequestTask.onHeadersReceived

import Taro from '@tarojs/taro'
import { validateParams, callAsyncSuccess, callAsyncFail } from '../utils'
const http = require('@ohos.net.http')

type Request = typeof Taro.request
const METHOD: string [] = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']

interface IRequestResultOHOS {
  result: string | TaroGeneral.IAnyObject
  responseCode: number
  header
}

interface IRequestParamsOHOS {
  method?: string,
  header?: TaroGeneral.IAnyObject,
  extraData?: TaroGeneral.IAnyObject
  readTimeout?: number,
  connectTimeout?: number
}

const requestSchema = {
  url: 'String'
}

// TODO: 增加函数类型
const request: Request = function (options) {
  let httpRequestOhos
  try {
    console.error('ddoowwnnllooaadd rreeqquueesstt ERROR 1: ' + http)
    httpRequestOhos = http.createHttp()
  } catch (error) {
    console.error('ddoowwnnllooaadd rreeqquueesstt ERROR 2: ' + error)
  }
  // const httpRequestOhos = http.createHttp()
  console.warn('rreeqquueesstt TARO 1: ' + httpRequestOhos)

  const requestTask: any = new Promise((resolve, reject) => {
    const { url, method, header, timeout } = options

    try {
      validateParams('send', options, requestSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    if (method) {
      if (!METHOD.includes(method)) {
        const error = { errMsg: `request fail parameter error: the method value should be one of the ${METHOD.join(',')}` }
        callAsyncFail(reject, error, options)
      }
    }

    const requestParamsOHOS: IRequestParamsOHOS = {
      method,
      header,
      readTimeout: timeout,
      connectTimeout: timeout
    }
    console.warn('rreeqquueesstt TARO requestParamsOHOS 2: ' + JSON.stringify(requestParamsOHOS) + resolve)

    httpRequestOhos.request(url, requestParamsOHOS).then((data: IRequestResultOHOS) => {
      const reswx = {
        data: data.result,
        statusCode: data.responseCode,
        header: data.header
      }
      callAsyncSuccess(resolve, reswx, options)
    }).catch(error => {
      callAsyncFail(reject, error, options)
    })
  })

  // 以下方法需要先获取 RequestTask 对象
  requestTask.abort = function () {
    httpRequestOhos.destroy()
  }

  requestTask.onHeadersReceived = function (callback) {
    validateParams('onHeadersReceived', [callback], ['Function'])
    httpRequestOhos.on('headerReceive', (err, res) => {
      callback(!err ? res : err)
    })
  }

  requestTask.offHeadersReceived = function (callback) {
    validateParams('offHeadersReceived', [callback], ['Function'])
    httpRequestOhos.off('headerReceive', (err, res) => {
      callback(!err ? res : err)
    })
  }

  return requestTask
}

export {
  request
}
