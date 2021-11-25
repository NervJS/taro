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
import { IAsyncParams } from '../utils/types'
import { General } from '@tarojs/taro/types'
import { validateParams, shouleBeObject } from './validate'

const webSocket = require('@ohos.net.webSocket')
console.warn('111webSocket', shouleBeObject)
console.warn('222webSocket', webSocket)
try {
  const ws = webSocket.createWebSocket()
  console.warn(333, ws)
} catch (err) {
  console.warn('1383283trycatchwebSocket', JSON.stringify(err))
}

// const ws = webSocket.createWebSocket()
const SocketTaskWX: General.IAnyObject = {}
// console.warn(333, ws)

interface IOptions extends IAsyncParams {
  header?: General.IAnyObject
}
interface IConnectSocket {
  url: string
  options: IOptions
}
// 不支持微信小程序 protocols，tcpNoDelay，perMessageDeflate，timeout 参数
function connectSocket (params: IConnectSocket = { url: '', options: {} }) {
  // 必填参数校验
  const requiredParams: Array<any> = params.url === '' ? [] : [params.url]
  const requiredParamsName: Array<string> = ['url']
  const required: Array<string> = ['string']
  const { res, isPassed } = validateParams('connectSockets', params, requiredParams, required, requiredParamsName)
  if (!isPassed) {
    return Promise.reject(res)
  }
  const { url, options } = params
  const { header, success, fail, complete } = options
  console.warn(url)
  console.warn(header, success, fail, complete)

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

  return SocketTaskWX
}

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

export {
  connectSocket
}
