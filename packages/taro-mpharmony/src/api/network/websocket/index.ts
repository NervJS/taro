import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'
import { SocketTask } from './socketTask'

let socketTasks: SocketTask[] = []
let socketsCounter = 1

export function sendSocketMessage (options?: Taro.sendSocketMessage.Option) {
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `sendSocketMessage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { data, complete, success, fail } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'sendSocketMessage', success, fail, complete })

  // @ts-ignore
  const ret = native.sendSocketMessage({
    data: data,
    success: () => {
      return handle.success
    },
    fail: () => {
      return handle.fail({
        errMsg: getParameterError({
          para: 'data',
          correct: 'String',
          wrong: data
        })
      })
    }
  })
  return ret
}

export function onSocketOpen (callback?: Taro.onSocketOpen.Callback) {
  // @ts-expect-error
  native.onSocketOpen(callback)
}

export function onSocketMessage (callback?: Taro.onSocketMessage.Callback) {
  // @ts-ignore
  native.onSocketMessage(callback)
}

export function onSocketError (callback?: Taro.onSocketError.Callback) {
  // @ts-ignore
  native.onSocketError(callback)
}

export function onSocketClose (callback?: Taro.onSocketClose.Callback) {
  // @ts-ignore
  native.onSocketClose(callback)
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

    // options.url must be invalid
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

  // @ts-ignore
  native.closeSocket({
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
          wrong: reason
        })
      })
    }
  })
}
