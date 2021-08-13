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

    const { data = '', success, fail, complete } = obj

    if (this.readyState !== 1) {
      const res = { errMsg: 'SocketTask.send:fail SocketTask.readState is not OPEN' }
      console.error(res.errMsg)
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

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
    // 主动断开时需要重置链接数
    this._destroyWhenClose && this._destroyWhenClose()
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
      // 若服务器方断掉也需要重置链接数
      this._destroyWhenClose && this._destroyWhenClose()
      func(this.closeDetail || { code: 1006, reason: 'abnormal closure' })
    }
  }

  onError (func) {
    this.ws.onerror = func
  }
}
