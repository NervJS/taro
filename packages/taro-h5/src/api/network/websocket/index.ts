import { SocketTask } from './socketTask'
import { shouldBeObject, getParameterError } from '../../utils'
import { MethodHandler } from '../../utils/handler'

let socketTasks: SocketTask[] = []
let socketsCounter = 1

export function sendSocketMessage () {
  console.warn('Deprecated.Please use socketTask.send instead.')
}

export function onSocketOpen () {
  console.warn('Deprecated.Please use socketTask.onOpen instead.')
}

export function onSocketMessage () {
  console.warn('Deprecated.Please use socketTask.onMessage instead.')
}

export function onSocketError () {
  console.warn('Deprecated.Please use socketTask.onError instead.')
}

export function onSocketClose () {
  console.warn('Deprecated.Please use socketTask.onClose instead.')
}

export function connectSocket (options) {
  const name = 'connectSocket'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { url, protocols, success, fail, complete } = options
    const handle = new MethodHandler<{
      socketTaskId?: number
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof url !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'url',
          correct: 'String',
          wrong: url
        })
      }, reject)
    }

    // options.url must be invalid
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      return handle.fail({
        errMsg: `request:fail invalid url "${url}"`
      }, reject)
    }

    // protocols must be array
    const _protocols = Array.isArray(protocols) ? protocols : null

    // 2 connection at most
    if (socketTasks.length > 1) {
      return handle.fail({
        errMsg: '同时最多发起 2 个 socket 请求，更多请参考文档。'
      }, reject)
    }

    const task = new SocketTask(url, _protocols)
    task._destroyWhenClose = function () {
      socketTasks = socketTasks.filter(socketTask => socketTask !== this)
    }
    socketTasks.push(task)

    handle.success({
      socketTaskId: socketsCounter++
    })

    return resolve(task)
  })
}

export function closeSocket () {
  console.warn('Deprecated.Please use socketTask.close instead.')
}
