interface SocketTask {
  ws: WebSocket;
  _destroyWhenClose: () => void;
  closeDetail: {
    code: number;
    reason: string;
  };
}

class SocketTask {
  constructor (url: string, protocols: string[] | undefined) {
    if (protocols) {
      // eslint-disable-next-line no-undef
      this.ws = new WebSocket(url, protocols)
    } else {
      // eslint-disable-next-line no-undef
      this.ws = new WebSocket(url)
    }
  }

  get CONNECTING () {
    return 0
  }

  get OPEN () {
    return 1
  }

  get CLOSING () {
    return 2
  }

  get CLOSED () {
    return 3
  }

  get readyState (): number {
    return this.ws.readyState
  }

  send(opts: Taro.SocketTask.SendOption): void {
    const { data, success, fail, complete } = opts
    const res = { errMsg: 'sendSocketMessage:ok' }

    try {
      this.ws.send(data)

      success?.(res)
      complete?.(res)
    } catch (err) {
      const res = { errMsg: err.message }

      fail?.(res)
      complete?.(res)
    }
  }

  close (opts?: Taro.SocketTask.CloseOption): void {
    const {
      code = 1000,
      reason = 'server complete, close',
      success,
      fail,
      complete
    } = opts || {}
    const res = { errMsg: 'closeSocket:ok' }
    this.closeDetail = { code, reason }

    try {
      this.ws.close(code, reason)
      // 把自己从链接数组中清除
      this._destroyWhenClose && this._destroyWhenClose()
      success?.(res)
      complete?.(res)
    } catch (err) {
      const res = { errMsg: err.message }
      fail?.(res)
      complete?.(res)
    }
  }

  onOpen (func?: Taro.SocketTask.OnOpenCallback): void {
    this.ws.onopen = () => {
      func && func({
        header: {}
      })
    }
  }

  onMessage (func?: Taro.SocketTask.OnMessageCallback): void {
    this.ws.onmessage = (res) => {
      func && func({
        data: res.data
      })
    }
  }

  onClose (func?: Taro.SocketTask.OnCloseCallback): void {
    this.ws.onclose = () => {
      this._destroyWhenClose && this._destroyWhenClose()
      func && func(this.closeDetail || { code: 1006, reason: 'abnormal closure' })
    }
  }

  onError (func?: Taro.SocketTask.OnErrorCallback): void {
    this.ws.onerror = () => {
      func && func({
        errMsg: "There was an error with your websocket.",
      })
    }
  }
}

export default SocketTask
