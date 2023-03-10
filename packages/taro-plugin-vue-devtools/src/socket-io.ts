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

import Taro from '@tarojs/taro'

import WebSocket from './websocket'

export default function createSocket (host) {
  class Socket {
    _ws: WebSocket
    sid: string
    ack: any
    ackTimeout: number
    isClosed = false

    constructor () {
      this.connect()
    }

    connect () {
      Taro.request({
        url: `http://${host}/socket.io/?EIO=3&transport=polling`
      })
        .then(({ data }) => {
          const target = /{.*}/.exec(data)?.[0] || ''
          try {
            const res = JSON.parse(target)
            this.sid = res.sid
            this.ackTimeout = res.pingTimeout
            this.initWS()
          } catch (error) {
            console.error('Vue DevTools 握手失败: ', error)
          }
        })
        .catch(() => {
          console.warn('请打开 Vue DevTools')
        })
    }

    on (event, cb) {
      this[`on-${event}`] = cb
    }

    emit (event, data) {
      if (this.isClosed) return

      // heart break
      clearTimeout(this.ack)
      this.ack = setTimeout(() => this._ws.send('2'), 5000)

      const msgList = data ? [event, data] : [event]
      const msg = JSON.stringify(msgList)
      // message: 4 + parser.EVENT: 2
      this._ws.send('42' + msg)
    }

    initWS () {
      const ws = new WebSocket(`ws://${host}/socket.io/?EIO=3&transport=websocket&sid=${this.sid}`)
      ws.onopen = () => {
        // close: 1
        // message: 4
        // noop: 6
        // open: 0
        // ping: 2
        // pong: 3
        // upgrade: 5
        ws.send('2probe')
      }
      ws.onmessage = ({ data }) => {
        if (data === '3probe') {
          // upgrade: 5
          ws.send('5')
          this['on-connect']()
        } else if (data === '3') {
          // pong
          this.ack = setTimeout(() => ws.send('2'), 5000)
        } else {
          const match = /\[.*\]/.exec(data)
          if (!match) return

          try {
            const [event, args = []] = JSON.parse(match[0])
            const cb = this[`on-${event}`]
            if (typeof cb === 'function') {
              // @TODO: 元素高亮暂时不实现，需要魔改 backend 的代码
              const _args = args.filter(arg => arg.event.indexOf(':mouse-over') === -1)
              cb(_args)
            }
          } catch (error) {
            console.error('Vue DevTools 解析 socket message 失败: ', error)
          }
        }
      }
      ws.onclose = reason => {
        this.isClosed = true
        this['on-disconnect'](reason)
      }
      ws.onerror = err => console.error('[Taro Socket]onerror', err)
      this._ws = ws
    }

    disconnect () {
      this.clean()
      if (!this.isClosed) {
        // message: 4 + close: 1
        this._ws.send('41')
        this._ws.close()
      }
    }

    clean () {
      clearTimeout(this.ack)
    }
  }

  return new Socket()
}
