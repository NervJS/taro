import SocketTask from './socketTask'

let socketTasks = []
let socketsCounter = 1

// 最多支持同时存在两个 websocket 链接
function checkTasks () {
  socketTasks = socketTasks.filter(task => task.readyState !== 3)
  if (socketTasks.length <= 1) return true
  return false
}

function connectSocket (options) {
  const name = 'connectSocket'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const optType = typeof options
    if (optType !== 'object') {
      const error = getParameterError({
        name,
        correct: 'Object',
        wrong: optType
      })
      console.error(error)
      return reject(error)
    }

    const { url, protocols, success, fail, complete } = options

    // options.url must be String
    const urlType = typeof url
    if (urlType !== 'string') {
      const error = getParameterError({
        name,
        para: 'url',
        correct: 'String',
        wrong: urlType
      })
      const res = { errMsg: error }
      console.error(error)
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    // options.url must be invalid
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      const error = `request:fail invalid url "${url}"`
      const res = { errMsg: error }
      console.error(error)
      fail && fail(res)
      complete && complete(res)
      return reject(res)
    }

    // protocols must be array
    const _protocols = Array.isArray(protocols) ? protocols : null

    // 2 connection at most
    if (!checkTasks()) {
      const errMsg = '同时最多发起 2 个 socket 请求，更多请参考文档。'
      console.error(errMsg)
      return reject(errMsg)
    }

    const task = new SocketTask(url, _protocols)
    socketTasks.push(task)

    const res = { socketTaskId: socketsCounter++, errMsg: 'connectSocket:ok' }
    success && success(res)
    complete && complete(res)

    return resolve(task)
  })
}

function onSocketOpen () {
  console.warin('Deprecated.Please use socketTask.onOpen instead.')
}

function onSocketError () {
  console.warin('Deprecated.Please use socketTask.onError instead.')
}

function sendSocketMessage () {
  console.warin('Deprecated.Please use socketTask.send instead.')
}

function onSocketMessage () {
  console.warin('Deprecated.Please use socketTask.onMessage instead.')
}

function closeSocket () {
  console.warin('Deprecated.Please use socketTask.close instead.')
}

function onSocketClose () {
  console.warin('Deprecated.Please use socketTask.onClose instead.')
}

function getParameterError ({ name, para, correct, wrong }) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  return `${name}: fail parameter error: ${parameter} should be ${correct} instead of ${wrong}`
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
