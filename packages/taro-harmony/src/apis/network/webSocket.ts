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
import Taro from '@tarojs/taro'
import { validateOptions, callAsyncFail, callAsyncSuccess, getParameterError } from '../utils'

type ConnectSocket = typeof Taro.connectSocket

const webSocket = require('@ohos.net.webSocket')

const connectSocket: ConnectSocket = function (options) {
  let ws
  const SocketTaskWX: any = new Promise((resolve, reject) => {
    ws = webSocket.createWebSocket()

    const { url, header } = options
    const voOtions = {
      funcName: 'connectSocket',
      options,
      rParamNames: ['url'],
      rTypes: ['string']
    }
    const { res, isPassed } = validateOptions(voOtions)
    if (!isPassed) {
      callAsyncFail(reject, res, options)
      return
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
      const voOtions = {
        funcName: 'close',
        options,
        rParamNames: ['code', 'reason'],
        rTypes: ['number', 'string']
      }
      const { res, isPassed } = validateOptions(voOtions)
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
  }
  SocketTaskWX.onClose = function (onCloseCallback) {
    return new Promise((resolve, reject) => {
      if (typeof onCloseCallback !== 'function') {
        const res = {
          errMsg: getParameterError({
            funcName: 'onClose',
            pName: 'onCloseCallback',
            pType: 'Function',
            pWrongType: typeof onCloseCallback
          })
        }
        return reject(res)
      }
      ws.on('close', (err, value) => {
        onCloseCallback(value)
        return err ? reject(err) : resolve(value)
      })
    })
  }
  SocketTaskWX.onError = function (onErrorCallback) {
    return new Promise((resolve, reject) => {
      if (typeof onErrorCallback !== 'function') {
        const res = {
          errMsg: getParameterError({
            funcName: 'onError',
            pName: 'onErrorCallback',
            pType: 'Function',
            pWrongType: typeof onErrorCallback
          })
        }
        return reject(res)
      }
      ws.on('error', (err) => {
        onErrorCallback(err)
        return resolve(err)
      })
    })
  }
  SocketTaskWX.onMessage = function (onMessageCallback?: any) {
    return new Promise((resolve, reject) => {
      if (typeof onMessageCallback !== 'function') {
        const res = {
          errMsg: getParameterError({
            funcName: 'onMessage',
            pName: 'onMessageCallback',
            pType: 'Function',
            pWrongType: typeof onMessageCallback
          })
        }
        return reject(res)
      }
      ws.on('close', (err, value) => {
        onMessageCallback(value)
        return err ? reject(err) : resolve(value)
      })
    })
  }
  SocketTaskWX.onOpen = function (onOpenCallback) {
    return new Promise((resolve, reject) => {
      if (typeof onOpenCallback !== 'function') {
        const res = {
          errMsg: getParameterError({
            funcName: 'onOpen',
            pName: 'onOpenCallback',
            pType: 'Function',
            pWrongType: typeof onOpenCallback
          })
        }
        return reject(res)
      }
      ws.on('open', (err, value) => {
        onOpenCallback(value)
        return err ? reject(err) : resolve(value)
      })
    })
  }
  SocketTaskWX.send = function (sendOptions) {
    return new Promise((resolve, reject) => {
      const { data } = sendOptions
      const voOtions = {
        funcName: 'send',
        options,
        rParamNames: ['data'],
        rTypes: ['string']
      }
      const { res, isPassed } = validateOptions(voOtions)
      if (!isPassed) {
        callAsyncFail(reject, res, sendOptions)
        return
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
