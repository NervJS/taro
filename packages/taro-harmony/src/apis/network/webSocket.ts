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
const webSocket = require('@ohos.net.webSocket')

const ws = webSocket.createWebSocket()

interface IConnectSocket extends IAsyncParams {
  url: string
  header?: General.IAnyObject
}
function connectSocket (options: IConnectSocket) {
  ws.connect(options.url, (err: boolean, value: General.IAnyObject) => {
    if (!err) {
      // eslint-disable-next-line no-console
      console.log('connect success' + value)
    } else {
      // eslint-disable-next-line no-console
      console.log('connect fail, err:' + JSON.stringify(err))
    }
  })
}

export {
  connectSocket
}
