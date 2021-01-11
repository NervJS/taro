import SocketTask from './socketTask'

let socketsCounter = 1
let socketTasks: any[] = []

export function connectSocket(opts: Taro.connectSocket.Option): Promise<Taro.SocketTask> {
  return new Promise((resolve, reject) => {
    const { url, success, fail, complete } = opts
    let { protocols } = opts
    const res: any = { errMsg: 'connectSocket:ok' }

    if (typeof url !== 'string') {
      const error = new Error('connectSocket:fail parameter error: parameter.url should be String')
      res.errMsg = error.message
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    if (Object.prototype.toString.call(protocols) !== '[object Array]') {
      protocols = undefined
    }

    // 最多同时存在两个SocketTask
    if (socketTasks.length >= 2) {
      const error = new Error('同时最多发起 2 个 socket 请求，更多请参考文档。')
      res.errMsg = error.message
      console.error(res.errMsg)
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    const task: any = new SocketTask(url, protocols)
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

function onSocketOpen (): void {
  console.warn('已废弃。请使用socketTask.onOpen方法')
}

function onSocketError (): void {
  console.warn('已废弃。请使用socketTask.onError方法')
}

function sendSocketMessage (): void {
  console.warn('已废弃。请使用socketTask.send方法')
}

function onSocketMessage (): void {
  console.warn('已废弃。请使用socketTask.onMessage方法')
}

function closeSocket (): void {
  console.warn('已废弃。请使用socketTask.close方法')
}

function onSocketClose (): void {
  console.warn('已废弃。请使用socketTask.onClose方法')
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
