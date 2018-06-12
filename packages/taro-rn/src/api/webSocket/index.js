import SocketTask from './socketTask'

let socketsCounter = 0
let socketTasks = []

// 最多同时存在两个SocketTask
function limitSocketTask (SocketTask) {
  if (socketTasks.length >= 2) {
    const oldSocketTask = socketTasks.shift()
    oldSocketTask.close()
  }
  socketTasks.push(SocketTask)
}

export function connectSocket (opts = {}) {
  return new Promise((resolve, reject) => {
    const { url, success, fail, complete } = opts
    let { protocols } = opts
    const res = { errMsg: 'connectSocket:ok' }

    if (typeof url !== 'string') {
      const error = new Error(`url必须是字符串`)
      res.errMsg = error.message
      console.error(error)
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    if (Object.prototype.toString.call(protocols) !== '[object Array]') {
      protocols = null
    }

    const task = new SocketTask(url, protocols)
    limitSocketTask(task)

    res.socketTaskId = socketsCounter++
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
