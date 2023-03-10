/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
