// OpenHarmony 不支持全局操作 WebSocket
// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-net-websocket-0000001168304641
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.sendSocketMessage.html
// ✅ wx.connectSocket
// ✅ SocketTask
// ✅ SocketTask.close
// ✅ SocketTask.onClose
// ✅ SocketTask.onError
// ✅ SocketTask.onMessage
// ✅ SocketTask.onOpen
// ✅ SocketTask.send

// ❌ wx.sendSocketMessage
// ❌ wx.onSocketOpen
// ❌ wx.onSocketMessage
// ❌ wx.onSocketError
// ❌ wx.onSocketClose
// ❌ wx.closeSocket

import webSocket from '@ohos.net.webSocket'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'
import { IAsyncParams } from '../utils/types'

type ConnectSocket = typeof Taro.connectSocket

interface ISendSocketOptions extends IAsyncParams {
  data: string
}

const connectSocketSchema = {
  url: 'String'
}

// const closetSocketSchema = {
//   code: 'Number',
//   reason: 'String'
// }

const sendSocketSchema = {
  data: 'String'
}

const connectSocket: ConnectSocket = function (options) {
  let ws
  const SocketTaskWX: any = new Promise((resolve, reject) => {
    ws = webSocket.createWebSocket()

    const { url, header } = options

    try {
      validateParams('uploadFile', options, connectSocketSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const result = {
      errMsg: 'websocket connect success'
    }
    ws.connect(url, { header }).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((err) => {
      result.errMsg = 'websocket connect fail'
      callAsyncFail(reject, err, options)
    })
  })

  SocketTaskWX.close = function (closeOptions) {
    return new Promise((resolve, reject) => {
      // TODO: 检验非必须参数
      // try {
      //   validateParams('close', options, closeSocketSchema)
      // } catch (error) {
      //   const res = { errMsg: error.message }
      //   return callAsyncFail(reject, res, options)
      // }

      ws.close(closeOptions).then(value => {
        callAsyncSuccess(resolve, value, closeOptions)
      }, error => {
        callAsyncFail(reject, error, closeOptions)
      })
    })
  }
  SocketTaskWX.onClose = function (onCloseCallback) {
    validateParams('onClose', [onCloseCallback], ['Function'])
    ws.on('close', (err, value) => {
      onCloseCallback(!err ? value : err)
    })
  }
  SocketTaskWX.onError = function (onErrorCallback) {
    validateParams('onError', [onErrorCallback], ['Function'])
    ws.on('error', (err) => {
      onErrorCallback(err)
    })
  }
  SocketTaskWX.onMessage = function (onMessageCallback?: any) {
    validateParams('onMessage', [onMessageCallback], ['Function'])
    ws.on('onMessage', (err, value) => {
      onMessageCallback(!err ? value : err)
    })
  }
  SocketTaskWX.onOpen = function (onOpenCallback) {
    validateParams('onOpen', [onOpenCallback], ['Function'])
    ws.on('open', (err, value) => {
      // TODO：返回数据字段完全不一样，无法兼容，暂不处理
      // wx:{header, profile}, ohos:{err, value:{status, message}}
      onOpenCallback(!err ? value : err)
    })
  }
  SocketTaskWX.send = function (sendOptions: ISendSocketOptions) {
    return new Promise((resolve, reject) => {
      const { data } = sendOptions
      try {
        validateParams('send', sendOptions, sendSocketSchema)
      } catch (error) {
        const res = { errMsg: error.message }
        return callAsyncFail(reject, res, options)
      }

      ws.send(data).then(value => {
        callAsyncSuccess(resolve, value, sendOptions)
      }, error => {
        callAsyncFail(reject, error, sendOptions)
      })
    })
  }

  return SocketTaskWX
}

export {
  connectSocket
}
