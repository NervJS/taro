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

import Taro from '@tarojs/api'
import { isFunction } from '@tarojs/shared'

export class SocketTask {
  ws: WebSocket
  CONNECTING: number
  OPEN: number
  CLOSING: number
  CLOSED: number
  closeDetail: { code: any, reason: any }
  _destroyWhenClose?: () => void

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

  send (opts: Partial<Taro.SocketTask.SendOption> = {}) {
    if (typeof opts !== 'object' || !opts) opts = {}

    const { data = '', success, fail, complete } = opts

    if (this.readyState !== 1) {
      const res = { errMsg: 'SocketTask.send:fail SocketTask.readState is not OPEN' }
      console.error(res.errMsg)
      isFunction(fail) && fail(res)
      isFunction(complete) && complete(res)
      return Promise.reject(res)
    }

    this.ws.send(data)

    const res = { errMsg: 'sendSocketMessage:ok' }
    isFunction(success) && success(res)
    isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }

  close (opts: Partial<Taro.SocketTask.CloseOption> = {}) {
    if (typeof opts !== 'object' || !opts) opts = {}

    const {
      code = 1000,
      reason = 'server complete,close',
      success,
      complete
    } = opts

    this.closeDetail = { code, reason }
    // 主动断开时需要重置链接数
    this._destroyWhenClose && this._destroyWhenClose()
    this.ws.close()

    const res = { errMsg: 'closeSocket:ok' }
    isFunction(success) && success(res)
    isFunction(complete) && complete(res)
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
