// OpenHarmony 不支持全局操作 WebSocket
// ❌ wx.sendSocketMessage
// ❌ wx.onSocketOpen
// ❌ wx.onSocketMessage
// ❌ wx.onSocketError
// ❌ wx.onSocketClose
// ❌ wx.closeSocket

// ✅ wx.connectSocket
// ❌ SocketTask
//  ✅ SocketTask.close
//  ❌ SocketTask.onClose
//  ❌ SocketTask.onError
//  ❌ SocketTask.onMessage
//  ❌ SocketTask.onOpen
//  ❌ SocketTask.send
import { IAsyncParams } from '../utils/types'
import { General } from '@tarojs/taro/types'
import { validateParams, shouleBeObject } from './validate'
const webSocket = require('@ohos.net.webSocket')

let ws = webSocket.createWebSocket()

interface IOptions extends IAsyncParams {
  header?: General.IAnyObject
}
interface IConnectSocket {
  url: string
  options: IOptions
}
// 不支持微信小程序 protocols，tcpNoDelay，perMessageDeflate，timeout 参数
function connectSocket (params: IConnectSocket = { url: '', options: {} }) {
  const requiredParams: Array<any> = params.url === '' ? [] : [params.url]
  const requiredParamsName: Array<string> = ['url']
  const required: Array<string> = ['string']
  const { res, isPassed } = validateParams('connectSockets', params, requiredParams, required, requiredParamsName)
  if (!isPassed) {
    return Promise.reject(res)
  }
  const { url, options } = params
  const { header, success, fail, complete } = options

  if (success || fail || complete) {
    // TODO: 写法待优化
    if (header) {
      const { res: resHeader, msg } = shouleBeObject('connectSockets', params, 'header')
      if (!resHeader) {
        const errMsg = {
          errMsg: msg
        }
        return Promise.reject(errMsg)
      }

      ws.connect(url, { header }, (res: any) => {
        if (!res) {
          fail && fail(res)
        } else {
          success && success(res)
          return ws
        }
        complete && complete(res)
      })
    } else {
      ws.connect(url, (res: any) => {
        if (!res) {
          fail && fail(res)
        } else {
          success && success(res)
          return ws
        }
        complete && complete(res)
      })
    }
  } else {
    ws = ws.connect(url)
  }

  return ws
}

interface IWebSocketCloseOptions extends IAsyncParams {
  code?: number,
  reason?: string
}
interface ISimpleWebSocketCloseOptions {
  code?: number,
  reason?: string
}

function close (params: IWebSocketCloseOptions) {
  const requiredParams: Array<any> = params.code === undefined ? [] : [params.code]
  if (params.reason !== undefined) {
    requiredParams.push(params.reason)
  }
  const requiredParamsName: Array<string> = params.code === undefined ? [] : ['code']
  if (params.reason !== undefined) {
    requiredParamsName.push('reason')
  }
  const required: Array<string> = params.code === undefined ? [] : ['number']
  if (params.reason !== undefined) {
    requiredParamsName.push('string')
  }
  const { res, isPassed } = validateParams('connectSockets', params, requiredParams, required, requiredParamsName)
  if (!isPassed) {
    return Promise.reject(res)
  }

  const { code, reason, success, fail, complete } = params
  const options : ISimpleWebSocketCloseOptions = {
    code,
    reason
  }

  if (success || fail || complete) {
    ws.close(options, (res: any) => {
      if (!res) {
        success && success(res)
      } else {
        fail && fail(res)
      }
      complete && complete(res)
    })
  } else {
    ws = ws.close(options)
  }
  return ws
}

export {
  connectSocket,
  close
}
