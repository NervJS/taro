// ✅ wx.request
// ✅ RequestTask.abort
// ✅ RequestTask.offHeadersReceived
// ✅ RequestTask.onHeadersReceived
// import Taro from '@tarojs/taro'
import { validateOptions } from './validate'
// import { callAsyncSuccess, callAsyncFail } from '../utils'
import { callAsyncFail } from '../utils'
const http = require('@ohos.net.http')
console.warn('rreeqquueesstt TARO 0 http: ' + http)

// type Request = typeof Taro.request
const METHOD: string [] = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']

const httpRequestOhos = http.createHttp()
// const requestTask: RequestTask = {}
console.warn('rreeqquueesstt TARO 1: ' + httpRequestOhos)

// interface IRequestResultWX {
//   data: string | TaroGeneral.IAnyObject
//   statusCode: number
//   header
// }

// interface IRequestResultOHOS {
//   result: string | TaroGeneral.IAnyObject
//   responseCode: number
//   header
// }
interface IRequestParamsOHOS {
  method?: string,
  header?: TaroGeneral.IAnyObject,
  extraData?: TaroGeneral.IAnyObject
  readTimeout?: number,
  connectTimeout?: number
}
// TODO: 增加函数类型
const request = function (options) {
  return new Promise((resolve, reject) => {
    const { url, method, header, timeout } = options
    const requiredParamsValue: Array<any> = [url]
    const requiredParamsName: Array<string> = ['url']
    const requiredParamsType: Array<string> = ['string']
    const { res, isPassed } = validateOptions('request', options, requiredParamsValue, requiredParamsType, requiredParamsName)
    if (!isPassed) {
      callAsyncFail(reject, res, options)
      return
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
  })
}
// 以下方法需要先获取 RequestTask 对象
// RequestTask.destroy = function destroy () {
//   httpRequestOhos.destroy
// }

// RequestTask.onHeadersReceived = function onHeadersReceived (callback: (options: General.IAnyObject) => void) {
//   httpRequestOhos.on('headerReceive', (err: any, res: IHttpOptionsOHOS) => {
//     callback(!err ? res : err)
//   })
// }

// RequestTask.offHeadersReceived = function offHeadersReceived (callback: (options: General.IAnyObject) => void) {
//   httpRequestOhos.off('headerReceive', (err: any, res: IHttpOptionsOHOS) => {
//     callback(!err ? res : err)
//   })
// }

export {
  request
}
