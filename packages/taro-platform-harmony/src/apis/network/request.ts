// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-net-http-0000001168304341
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
// ✅ wx.request
// ✅ RequestTask.abort
// ✅ RequestTask.offHeadersReceived
// ✅ RequestTask.onHeadersReceived

import { isString, isUndefined } from '@tarojs/shared'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

const http = require('@ohos.net.http')

type Request<T = any, U = any> = typeof Taro.request<T, U>
const METHOD: string [] = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']

interface IRequestResultOHOS {
  result: string | TaroGeneral.IAnyObject
  responseCode: number
  header
}

interface IRequestParamsOHOS {
  method?: string
  header?: TaroGeneral.IAnyObject
  extraData?: TaroGeneral.IAnyObject | string
  readTimeout?: number
  connectTimeout?: number
}

const requestSchema = {
  url: 'String'
}

const request: Request = function (options) {
  let httpRequestOhos

  const requestTask: any = new Promise((resolve, reject) => {
    try {
      httpRequestOhos = http.createHttp()
    } catch (error) {
      const res = { errMsg: error }
      return callAsyncFail(reject, res, options)
    }

    const { url, method, header = {}, timeout, dataType, data } = options

    try {
      validateParams('send', options, requestSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const keyOfContentType = Object.keys(header).find(item => item.toLowerCase() === 'content-type')

    if (!keyOfContentType) {
      header['Content-Type'] = 'application/json'
    }

    // 检查 Header 是否有 Referer
    if (isUndefined(header.Referer)) {
      const error = { errMsg: 'request fail parameter error: the header doesn‘t support Referer property' }
      callAsyncFail(reject, error, options)
    }

    // 检查 method 是否正确
    if (method) {
      if (!METHOD.includes(method)) {
        const error = { errMsg: `request fail parameter error: the method value should be one of the ${METHOD.join(',')}` }
        callAsyncFail(reject, error, options)
      }
    }

    const requestParamsOHOS: IRequestParamsOHOS = {
      method,
      header,
      extraData: data,
      readTimeout: timeout,
      connectTimeout: timeout
    }

    httpRequestOhos.request(url, requestParamsOHOS).then((requestData: IRequestResultOHOS) => {
      const reswx = {
        data: dataType === 'json' && isString(requestData.result) ? JSON.parse(requestData.result) : requestData.result,
        statusCode: requestData.responseCode,
        header: JSON.parse(requestData.header)
      }
      callAsyncSuccess(resolve, reswx, options)
    }).catch(error => {
      callAsyncFail(reject, error, options)
    })
  })

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
