// ✅ wx.request
// ✅ RequestTask.abort
// ✅RequestTask.offHeadersReceived
// ✅ RequestTask.onHeadersReceived
import { General } from '@tarojs/taro'
import { validateParams } from './validate'
const http = require('@ohos.net.http')

const httpRequest = http.createHttp()
const RequestTask: General.IAnyObject = {}

// const METHOD = {
//   OPTIONS: 'OPTIONS',
//   GET: 'GET',
//   HEAD: 'HEAD',
//   POST: 'POST',
//   PUT: 'PUT',
//   DELETE: 'DELETE',
//   TRACT: 'TRACE',
//   CONNECT: 'CONNECT'
// }

const METHOD: string [] = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']

// wx 和 鸿蒙接口的参数不一致
interface IHttpOptionsWX {
  data: string | General.IAnyObject
  statusCode: number
  header
}
interface IHttpOptionsOHOS {
  result: string | General.IAnyObject
  responseCode: number
  header
}
interface IRequestParams {
  url: string,
  method?: string,
  header?: General.IAnyObject,
  timeout?: number,
  complete?: (res: any) => void
  fail?: (res: General.CallbackResult) => void
  success?: (res: IHttpOptionsWX) => void
}
function request (params: IRequestParams) {
  const requiredParams: Array<any> = params.url === '' ? [] : [params.url]
  const requiredParamsName: Array<string> = ['url']
  const required: Array<string> = ['string']
  const { res, isPassed } = validateParams('request', params, requiredParams, required, requiredParamsName)
  if (!isPassed) {
    const errMsg:General.IAnyObject = { errMsg: `request fail parameter error: the method value should be one of the ${METHOD.join('')}` }
    return Promise.reject(errMsg)
  }

  const { url, method, header, timeout, success, fail, complete } = params

  const options: General.IAnyObject = {}
  if (method) {
    if (METHOD.includes(method)) {
      options.method = method
    } else {
      return Promise.reject(res)
    }
  }
  if (header) options.header = header
  if (timeout) {
    options.readTimeout = timeout
    options.connectTimeout = timeout
  }

  // if (success || fail || complete) {
  httpRequest.request(url, options, (err: any, res: IHttpOptionsOHOS) => {
    if (!err) {
      const wxParams: IHttpOptionsWX = {
        data: res.result,
        statusCode: res.responseCode,
        header: res.header
      }
      success && success(wxParams)
      complete && complete(wxParams)
    } else {
      fail && fail(err)
      complete && complete(err)
    }
  })
  // } else {
  //   const promise = httpRequest.request(url, options)
  //   promise.then((value) => {
  //     const pres: IHttpOptionsWX = {
  //       data: value.result,
  //       statusCode: value.responseCode,
  //       header: value.header
  //     }
  //     return Promise.resolve(pres)
  //   }).catch((err) => {
  //     return Promise.reject(err)
  //   })
  // }
  // return RequestTask
}

// 以下方法需要先获取 RequestTask 对象
RequestTask.destroy = function destroy () {
  httpRequest.destroy
}

RequestTask.onHeadersReceived = function onHeadersReceived (callback: (options: General.IAnyObject) => void) {
  httpRequest.on('headerReceive', (err: any, res: IHttpOptionsOHOS) => {
    callback(!err ? res : err)
  })
}

RequestTask.offHeadersReceived = function offHeadersReceived (callback: (options: General.IAnyObject) => void) {
  httpRequest.off('headerReceive', (err: any, res: IHttpOptionsOHOS) => {
    callback(!err ? res : err)
  })
}

export {
  request
}
