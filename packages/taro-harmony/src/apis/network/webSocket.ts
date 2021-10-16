// ❌ wx.sendSocketMessage
// ❌ wx.onSocketOpen
// ❌ wx.onSocketMessage
// ❌ wx.onSocketError
// ❌ wx.onSocketClose
// ✅ wx.connectSocket
// ❌ wx.closeSocket
// ❌ SocketTask
//  ❌ SocketTask.close
//  ❌ SocketTask.onClose
//  ❌ SocketTask.onError
//  ❌ SocketTask.onMessage
//  ❌ SocketTask.onOpen
//  ❌ SocketTask.send
import { IAsyncParams } from '../utils/types'
import { General } from '@tarojs/taro/types'
import { validateParams } from './validate'
const webSocket = require('@ohos.net.webSocket')

const ws = webSocket.createWebSocket()

interface IOptions extends IAsyncParams {
  header?: General.IAnyObject
}
interface IConnectSocket {
  url: string
  options: IOptions
}
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
    if (header) {
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
    const wsPromise = ws.connect(url)
    return Promise.resolve(wsPromise)
  }
}

export {
  connectSocket
}
