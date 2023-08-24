import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'
import { SocketTask } from './socketTask'

let socketTasks: SocketTask[] = []
let socketsCounter = 1
const socketCallbacks: {
  onSocketOpen?: Taro.onSocketOpen.Callback
  onSocketMessage?: Taro.onSocketMessage.Callback
  onSocketError?: Taro.onSocketError.Callback
  onSocketClose?: Taro.onSocketClose.Callback
} = {}

export function sendSocketMessage (options?: Taro.sendSocketMessage.Option) {
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `sendSocketMessage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { data, complete, success, fail } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'sendSocketMessage', success, fail, complete })

  if (socketTasks.length > 0) {
    socketTasks[0].send({
      data: data,
      success: () => {
        return handle.success
      },
      fail: () => {
        return handle.fail({
          errMsg: getParameterError({
            para: 'data',
            correct: 'String',
            wrong: data,
          }),
        })
      },
    })
  }
}

export function onSocketOpen (callback?: Taro.onSocketOpen.Callback) {
  socketCallbacks.onSocketOpen = callback
}

export function onSocketMessage (callback?: Taro.onSocketMessage.Callback) {
  socketCallbacks.onSocketMessage = callback
}

export function onSocketError (callback?: Taro.onSocketError.Callback) {
  socketCallbacks.onSocketError = callback
}

export function onSocketClose (callback?: Taro.onSocketClose.Callback) {
  socketCallbacks.onSocketClose = callback
}

export function connectSocket (options?: Taro.connectSocket.Option) {
  const name = 'connectSocket'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { url, protocols, success, fail, complete } = options as Exclude<typeof options, undefined>
    const handle = new MethodHandler<{
      socketTaskId?: number
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof url !== 'string') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'url',
            correct: 'String',
            wrong: url,
          }),
        },
        { resolve, reject }
      )
    }

    // options.url must be valid
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      return handle.fail(
        {
          errMsg: `request:fail invalid url "${url}"`,
        },
        { resolve, reject }
      )
    }

    // protocols must be array
    const _protocols = Array.isArray(protocols) ? protocols : null

    // 2 connection at most
    if (socketTasks.length > 1) {
      return handle.fail(
        {
          errMsg: '同时最多发起 2 个 socket 请求，更多请参考文档。',
        },
        { resolve, reject }
      )
    }

    const task = new SocketTask(url, _protocols)
    task._destroyWhenClose = function () {
      socketTasks = socketTasks.filter((socketTask) => socketTask !== this)
    }

    task.onOpen((res) => {
      socketCallbacks.onSocketOpen?.call(null, res)
    })
    task.onMessage((res) => {
      socketCallbacks.onSocketMessage?.call(null, res)
    })
    task.onError((res) => {
      socketCallbacks.onSocketError?.call(null, res)
    })
    task.onClose((res) => {
      socketCallbacks.onSocketClose?.call(null, res)
    })

    socketTasks.push(task)

    handle.success({
      socketTaskId: socketsCounter++,
    })

    return resolve(task)
  })
}

export function closeSocket (options?: Taro.closeSocket.Option) {
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `closeSocket:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { code, reason, complete, success, fail } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'closeSocket', success, fail, complete })

  for (const task of socketTasks) {
    task.close({
      code: code,
      reason: reason,
      success: () => {
        return handle.success
      },
      fail: () => {
        return handle.fail({
          errMsg: getParameterError({
            para: 'reason',
            correct: 'String',
            wrong: reason,
          }),
        })
      },
    })
    socketTasks = []
  }
}
