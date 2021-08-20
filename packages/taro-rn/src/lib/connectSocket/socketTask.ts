/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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

      success && success(res)
      complete && complete(res)
    } catch (err) {
      const res = { errMsg: err.message }

      fail && fail(res)
      complete && complete(res)
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
      success && success(res)
      complete && complete(res)
    } catch (err) {
      const res = { errMsg: err.message }
      fail && fail(res)
      complete && complete(res)
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
    this.ws.onerror = (res) => {
      func && func({
        errMsg: res.message
      })
    }
  }
}

export default SocketTask
