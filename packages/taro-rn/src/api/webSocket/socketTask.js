class SocketTask {
  constructor (url, protocols) {
    if (protocols) {
      this.ws = new WebSocket(url, protocols)
    } else {
      this.ws = new WebSocket(url)
    }
  }

  get readyState () {
    return this.ws.readyState
  }

  send (opts = {}) {
    if (Object.prototype.toString.call(opts) !== '[object Object]') {
      opts = {}
    }

    const { data, success, fail, complete } = opts
    const res = { errMsg: 'sendSocketMessage:ok' }

    try {
      this.ws.send(data)

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

  close (opts = {}) {
    if (Object.prototype.toString.call(opts) !== '[object Object]') {
      opts = {}
    }

    const {
      code = 1000,
      reason = 'server complete, close',
      success,
      fail,
      complete
    } = opts
    const res = { errMsg: 'closeSocket:ok' }
    this.closeDetail = { code, reason }

    try {
      this.ws.close(code, reason)
      // 把自己从链接数组中清除
      this._destroyWhenClose && this._destroyWhenClose()
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
    this.ws.onclose = () => {
      this._destroyWhenClose && this._destroyWhenClose()
      func(this.closeDetail || { code: 1006, reason: 'abnormal closure' })
    }
  }

  onError (func) {
    this.ws.onerror = func
  }
}

export default SocketTask
