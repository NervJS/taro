import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'
import { SocketTask } from './socketTask'

let socketTasks: SocketTask[] = []
let socketsCounter = 1

/**
 * 通过 WebSocket 连接发送数据
 * 
 * @canNotUse sendSocketMessage
 */
export function sendSocketMessage () {
  console.warn('Deprecated.Please use socketTask.send instead.')
}

/**
 * 监听 WebSocket 连接打开事件
 * 
 * @canNotUse onSocketOpen
 */
export function onSocketOpen () {
  console.warn('Deprecated.Please use socketTask.onOpen instead.')
}

/**
 * 监听 WebSocket 接受到服务器的消息事件
 * 
 * @canNotUse onSocketMessage
 */
export function onSocketMessage () {
  console.warn('Deprecated.Please use socketTask.onMessage instead.')
}

/**
 * 监听 WebSocket 错误事件
 * 
 * @canNotUse onSocketError
 */
export function onSocketError () {
  console.warn('Deprecated.Please use socketTask.onError instead.')
}

/**
 * 监听 WebSocket 连接关闭事件
 * 
 * @canNotUse onSocketClose
 */
export function onSocketClose () {
  console.warn('Deprecated.Please use socketTask.onClose instead.')
}

/**
 * 创建一个 WebSocket 连接
 * 
 * @canUse connectSocket
 * @__object [url, header, protocols, tcpNoDelay]
 */
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
    if (socketTasks.length >= 5) {
      return handle.fail(
        {
          errMsg: '同时最多发起 5 个 socket 请求，更多请参考文档。',
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

/**
 * 关闭 WebSocket 连接
 * 
 * @canNotUse closeSocket
 */
export function closeSocket () {
  console.warn('Deprecated.Please use socketTask.close instead.')
}

