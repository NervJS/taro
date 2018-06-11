class SocketTask {
  constructor (url, protocols) {
    if (protocols) {
      this.wx = new WebSocket(url, protocols)
    } else {
      this.wx = new WebSocket(url)
    }
  }

  get readyState () {
    return this.wx.readyState
  }

  send (opts) {
    const { data, success, fail, complete } = opts
    const res = { errMsg: 'sendSocketMessage:ok' }

    try {
      this.wx.send(data)

      success && success(res)
      complete && complete(res)
      return Promise.resolve(res)
    } catch (err) {
      const res = { errMsg: err.message }
      fail && fail(res)
      complete && complete(res)
      return Promise.reject(err)
    }
  }

  close (opts) {
    const {
      code = 1000,
      reason = 'server complete, close',
      success,
      fail,
      complete
    } = opts
    const res = { errMsg: 'closeSocket:ok' }

    try {
      this.wx.close(code, reason)

      success && success(res)
      complete && complete(res)
      return Promise.resolve(res)
    } catch (err) {
      const res = { errMsg: err.message }
      fail && fail(res)
      complete && complete(res)
      return Promise.reject(err)
    }
  }

  onOpen (func) {
    this.ws.onopen = func
  }

  onMessage (func) {
    this.ws.onmessage = func
  }

  onClose (func) {
    this.ws.onclose = func
  }

  onError (func) {
    this.ws.onerror = func
  }
}

export default SocketTask
