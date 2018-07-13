import SocketTask from './socketTask'

let socketsCounter = 1
let socketTasks = []

export function connectSocket (opts = {}) {
  return new Promise((resolve, reject) => {
    const { url, success, fail, complete } = opts
    let { protocols } = opts
    const res = { errMsg: 'connectSocket:ok' }

    if (typeof url !== 'string') {
      const error = new Error(`connectSocket:fail parameter error: parameter.url should be String`)
      res.errMsg = error.message
      console.error(res.errMsg)
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    if (Object.prototype.toString.call(protocols) !== '[object Array]') {
      protocols = null
    }

    // 最多同时存在两个SocketTask
    if (socketTasks.length >= 2) {
      const error = new Error(`同时最多发起 2 个 socket 请求，更多请参考文档。`)
      res.errMsg = error.message
      console.error(res.errMsg)
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    const task = new SocketTask(url, protocols)
    task._destroyWhenClose = () => {
      socketTasks = socketTasks.filter(socketTask => { return socketTask !== task })
    }
    socketTasks.push(task)

    res.socketTaskId = socketsCounter++
    res.socketTask = task

    success && success(res)
    complete && complete(res)

    return resolve(task)
  })
}

function onSocketOpen () {
  console.warn('已废弃。请使用socketTask.onOpen方法')
}

function onSocketError () {
  console.warn('已废弃。请使用socketTask.onError方法')
}

function sendSocketMessage () {
  console.warn('已废弃。请使用socketTask.send方法')
}

function onSocketMessage () {
  console.warn('已废弃。请使用socketTask.onMessage方法')
}

function closeSocket () {
  console.warn('已废弃。请使用socketTask.close方法')
}

function onSocketClose () {
  console.warn('已废弃.请使用socketTask.onClose方法')
}

export default {
  connectSocket,
  onSocketOpen,
  onSocketError,
  sendSocketMessage,
  onSocketMessage,
  closeSocket,
  onSocketClose
}
