export default class SocketTask {
  constructor (url, protocols) {
    if (protocols && protocols.length) {
      this.ws = new WebSocket(url, protocols)
    } else {
      this.ws = new WebSocket(url)
    }
    this.CONNECTING = 0
    this.OPEN = 1
    this.CLOSING = 2
    this.CLOSED = 3
  }

  get readyState () {
    return this.ws.readyState
  }

  send (obj = {}) {
    if (typeof obj !== 'object' || !obj) obj = {}

    const { data = '', success, complete } = obj
    this.ws.send(data)

    const res = { errMsg: 'sendSocketMessage:ok' }
    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  close (obj = {}) {
    if (typeof obj !== 'object' || !obj) obj = {}

    const {
      code = 1000,
      reason = 'server complete,close',
      success,
      complete
    } = obj

    this.closeDetail = { code, reason }
    this.ws.close()

    const res = { errMsg: 'closeSocket:ok' }
    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  onOpen (func) {
    this.ws.onopen = func
  }

  onMessage (func) {
    this.ws.onmessage = func
  }

  onClose (func) {
    this.ws.onclose = () => {
      func(this.closeDetail || { code: 1006, reason: 'abnormal closure' })
    }
  }

  onError (func) {
    this.ws.onerror = func
  }
}
