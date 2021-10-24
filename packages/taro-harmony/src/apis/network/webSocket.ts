// OpenHarmony 不支持全局操作 WebSocket
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

interface IWebSocketSendOptions extends IAsyncParams{
  data: string
}

function send (params: IWebSocketSendOptions) {
  const requiredParams: Array<any> = params.data === '' ? [] : [params.data]
  const requiredParamsName: Array<string> = ['data']
  const required: Array<string> = ['string']
  const { res, isPassed } = validateParams('send', params, requiredParams, required, requiredParamsName)
  if (!isPassed) {
    return Promise.reject(res)
  }

  const { data, success, fail, complete } = params
  if (success || fail || complete) {
    ws.send(data, (res: any) => {
      if (!res) {
        success && success(res)
      } else {
        fail && fail(res)
      }
      complete && complete(res)
    })
  } else {
    return ws.send(data)
  }
  return ws
}

interface IOnOpenCallbackValue {
  // TODO: 调试时确认 status 类型
  status: string,
  message: string
}
function onOpen (callback?: any) {
  ws.on('open', (err: any, value: IOnOpenCallbackValue) => {
    if (!err) {
      if (callback) {
        callback(value)
      } else {
        return Promise.resolve(value)
      }
    } else {
      return Promise.reject(err)
    }
  })
}

function onMessage (callback?: any) {
  ws.on('message', (err: any, value: string) => {
    if (!err) {
      if (callback) {
        callback(value)
      } else {
        return Promise.resolve(value)
      }
    } else {
      return Promise.reject(err)
    }
  })
}

function onError (callback?: any) {
  ws.on('error', (err: any) => {
    if (callback) {
      callback(err)
    } else {
      return Promise.resolve(err)
    }
  })
}

interface IOnCloseCallbackValue {
  // TODO: 调试时确认 status 类型
  code: number,
  reason: string
}
function onClose (callback?: any) {
  ws.on('close', (err: any, value: IOnCloseCallbackValue) => {
    if (!err) {
      if (callback) {
        callback(value)
      } else {
        return Promise.resolve(value)
      }
    } else {
      return Promise.reject(err)
    }
  })
}

export {
  connectSocket,
  close,
  send,
  onOpen,
  onMessage,
  onError,
  onClose
}
