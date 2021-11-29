// OpenHarmony 不支持全局操作 WebSocket
// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-net-websocket-0000001168304641
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.sendSocketMessage.html
// ❌ wx.sendSocketMessage
// ❌ wx.onSocketOpen
// ❌ wx.onSocketMessage
// ❌ wx.onSocketError
// ❌ wx.onSocketClose
// ❌ wx.closeSocket

// ✅ wx.connectSocket
// ✅ SocketTask
// ✅ SocketTask.close
// ✅ SocketTask.onClose
// ✅ SocketTask.onError
// ✅ SocketTask.onMessage
// ✅ SocketTask.onOpen
// ✅ SocketTask.send
import Taro, { SocketTask } from '@tarojs/taro'
import { callAsyncFail, callAsyncSuccess, getParameterError } from '../utils'
import { validateOptions } from './validate'

type ConnectSocket = typeof Taro.connectSocket

const webSocket = require('@ohos.net.webSocket')
const ws = webSocket.createWebSocket()

const connectSocket: ConnectSocket = function (options) {
  return new Promise((resolve, reject) => {
    const { url, header } = options
    const requiredParamsValue: Array<any> = [url]
    const requiredParamsName: Array<string> = ['url']
    const requiredParamsType: Array<string> = ['string']
    const { res, isPassed } = validateOptions('connectSockets', options, requiredParamsValue, requiredParamsType, requiredParamsName)
    if (!isPassed) {
      callAsyncFail(reject, res, options)
      return
    }

    const SocketTaskWX: SocketTask = {
      close: function (closeOptions) {
        return new Promise((resolve, reject) => {
          const { code, reason } = closeOptions
          const closeRequiredParamsValue: Array<any> = [code, reason]
          const closeRequiredParamsName: Array<string> = ['code', 'reason']
          const closeRequiredParamsType: Array<string> = ['number', 'string']

          const { res, isPassed } = validateOptions('connectSockets', closeOptions, closeRequiredParamsValue, closeRequiredParamsType, closeRequiredParamsName)
          if (!isPassed) {
            callAsyncFail(reject, res, closeOptions)
            return
          }
          ws.close(closeOptions).then(value => {
            callAsyncSuccess(resolve, value, closeOptions)
          }, error => {
            callAsyncFail(reject, error, closeOptions)
          })
        })
      },
      onClose: function (onCloseCallback) {
        return new Promise((resolve, reject) => {
          if (typeof onCloseCallback !== 'function') {
            const res = {
              errMsg: getParameterError({
                name: 'onClose',
                correct: 'Function',
                wrong: onCloseCallback
              })
            }
            return reject(res)
          }
          ws.on('close', (err, value) => {
            onCloseCallback(value)
            return err ? reject(err) : resolve(value)
          })
        })
      },
      onError: function onError (onErrorCallback) {
        return new Promise((resolve, reject) => {
          if (typeof onErrorCallback !== 'function') {
            const res = {
              errMsg: getParameterError({
                name: 'onError',
                correct: 'Function',
                wrong: onErrorCallback
              })
            }
            return reject(res)
          }
          ws.on('error', (err) => {
            onErrorCallback(err)
            return resolve(err)
          })
        })
      },
      onMessage: function onMessage (onMessageCallback?: any) {
        return new Promise((resolve, reject) => {
          if (typeof onMessageCallback !== 'function') {
            const res = {
              errMsg: getParameterError({
                name: 'onError',
                correct: 'Function',
                wrong: onMessageCallback
              })
            }
            return reject(res)
          }
          ws.on('close', (err, value) => {
            onMessageCallback(value)
            return err ? reject(err) : resolve(value)
          })
        })
      },
      onOpen: function (onOpenCallback) {
        return new Promise((resolve, reject) => {
          if (typeof onOpenCallback !== 'function') {
            const res = {
              errMsg: getParameterError({
                name: 'onError',
                correct: 'Function',
                wrong: onOpenCallback
              })
            }
            return reject(res)
          }
          ws.on('open', (err, value) => {
            onOpenCallback(value)
            return err ? reject(err) : resolve(value)
          })
        })
      },
      send: function (sendOptions) {
        const { data } = sendOptions
        const closeRequiredParamsValue: Array<any> = [data]
        const closeRequiredParamsName: Array<string> = ['data']
        const closeRequiredParamsType: Array<string> = ['string']

        const { res, isPassed } = validateOptions('connectSockets', sendOptions, closeRequiredParamsValue, closeRequiredParamsType, closeRequiredParamsName)
        if (!isPassed) {
          callAsyncFail(reject, res, sendOptions)
          return
        }
        ws.send(data).then(value => {
          callAsyncSuccess(resolve, value, sendOptions)
        }, error => {
          callAsyncFail(reject, error, sendOptions)
        })
      },
      socketTaskId: 0,
      readyState: 0,
      errMsg: '',
      CONNECTING: 0,
      OPEN: 0,
      CLOSING: 0,
      CLOSED: 0,
      ws
    }

    const result = {
      errMsg: ''
    }
    ws.connect(url, { header }).then((_value) => {
      result.errMsg = 'websocket connect success'
      callAsyncSuccess(resolve, result, options)
    }).catch((err) => {
      result.errMsg = 'websocket connect fail'
      callAsyncFail(reject, err, options)
    })

    return SocketTaskWX
  })
}

export {
  connectSocket
}

// if (success || fail || complete) {
//   // TODO: 写法待优化
//   if (header) {
//     const { res: resHeader, msg } = shouleBeObject('connectSockets', params, 'header')
//     if (!resHeader) {
//       const errMsg = {
//         errMsg: msg
//       }
//       return Promise.reject(errMsg)
//     }

//     ws.connect(url, { header }, (res: any) => {
//       if (!res) {
//         fail && fail(res)
//         complete && complete(res)
//       } else {
//         success && success(res)
//         complete && complete(res)
//         return SocketTaskWX
//       }
//     })
//   } else {
//     ws.connect(url, (res: any) => {
//       if (!res) {
//         fail && fail(res)
//         complete && complete(res)
//       } else {
//         success && success(res)
//         complete && complete(res)
//         return SocketTaskWX
//       }
//     })
//   }
// } else {
//   ws.connect(url)
//   return Promise.resolve(SocketTaskWX)
// }

// interface IWebSocketCloseOptions extends IAsyncParams {
//   code?: number,
//   reason?: string
// }
// interface ISimpleWebSocketCloseOptions {
//   code?: number,
//   reason?: string
// }

// SocketTaskWX.close = function close (params: IWebSocketCloseOptions) {
//   const requiredParams: Array<any> = params.code === undefined ? [] : [params.code]
//   if (params.reason !== undefined) {
//     requiredParams.push(params.reason)
//   }
//   const requiredParamsName: Array<string> = params.code === undefined ? [] : ['code']
//   if (params.reason !== undefined) {
//     requiredParamsName.push('reason')
//   }
//   const requiredParamsType: Array<string> = params.code === undefined ? [] : ['number']
//   if (params.reason !== undefined) {
//     requiredParamsType.push('string')
//   }
//   const { res, isPassed } = validateParams('connectSockets', params, requiredParams, requiredParamsType, requiredParamsName)
//   if (!isPassed) {
//     return Promise.reject(res)
//   }

//   const { code, reason, success, fail, complete } = params
//   const options : ISimpleWebSocketCloseOptions = {
//     code,
//     reason
//   }

//   if (success || fail || complete) {
//     ws.close(options, (res: any) => {
//       if (!res) {
//         success && success(res)
//       } else {
//         fail && fail(res)
//       }
//       complete && complete(res)
//     })
//   } else {
//     ws.close(options)
//   }
// }

// interface IWebSocketSendOptions extends IAsyncParams{
//   data: string
// }

// SocketTaskWX.send = function send (params: IWebSocketSendOptions) {
//   const requiredParams: Array<any> = params.data === '' ? [] : [params.data]
//   const requiredParamsName: Array<string> = ['data']
//   const required: Array<string> = ['string']
//   const { res, isPassed } = validateParams('send', params, requiredParams, required, requiredParamsName)
//   if (!isPassed) {
//     return Promise.reject(res)
//   }

//   const { data, success, fail, complete } = params
//   if (success || fail || complete) {
//     ws.send(data, (res: any) => {
//       if (!res) {
//         success && success(res)
//       } else {
//         fail && fail(res)
//       }
//       complete && complete(res)
//     })
//   } else {
//     ws.send(data)
//   }
// }

// interface IOnOpenCallbackValue {
//   // TODO: 调试时确认 status 类型
//   status: string,
//   message: string
// }
// SocketTaskWX.onOpen = function onOpen (callback?: any) {
//   ws.on('open', (err: any, value: IOnOpenCallbackValue) => {
//     if (!err) {
//       callback(value)
//     }
//   })
// }

// SocketTaskWX.onMessage = function onMessage (callback?: any) {
//   ws.on('message', (err: any, value: string) => {
//     if (!err) {
//       if (callback) {
//         callback(value)
//       }
//     }
//   })
// }

// SocketTaskWX.onError = function onError (callback?: any) {
//   ws.on('error', (err: any) => {
//     if (callback) {
//       callback(err)
//     }
//   })
// }

// interface IOnCloseCallbackValue {
//   // TODO: 调试时确认 status 类型
//   code: number,
//   reason: string
// }
// SocketTaskWX.onClose = function onClose (callback?: any) {
//   ws.on('close', (err: any, value: IOnCloseCallbackValue) => {
//     if (!err) {
//       if (callback) {
//         callback(value)
//       }
//     }
//   })
// }
