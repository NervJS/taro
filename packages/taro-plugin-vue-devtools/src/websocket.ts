/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

const ALIPAY = 'alipay'

export default class WebSocket {
  url: string
  readyState: number
  onclose: (res: any) => void
  onerror: (res: any) => void
  onmessage: (res: any) => void
  onopen: (res: any) => void

  private _ws: any

  constructor (url: string) {
    this.url = url
    this.readyState = this.CONNECTING

    Taro.connectSocket({
      url
    })
      .then(ws => {
        this._ws = ws

        ws.onClose(res => {
          this.readyState = this.CLOSED
          this.onclose(res)
        })

        ws.onError(res => {
          this.readyState = this.CLOSED
          this.onerror(res)
        })

        ws.onMessage(res => {
          this.onmessage(res)
        })

        if (this.readyState !== this.OPEN) {
          ws.onOpen(res => {
            this.readyState = this.OPEN
            this.onopen(res)
          })
        } else {
          // 支付宝全局的 onSocketOpen 已触发过了，直接调用 onopen
          this.onopen({})
        }
      })

    // 支付宝只支持一个 socket 连接，且 onSocketOpen 的触发时机比 connectSocket 回调的时机早
    if (process.env.TARO_ENV === ALIPAY) {
      Taro.onSocketOpen(() => {
        this.readyState = this.OPEN
      })
    }
  }

  public send (data) {
    this._ws.send({
      data
    })
  }

  public close (code?, reason?) {
    this.readyState = this.CLOSING
    this._ws.close({
      code: code || 1000,
      reason: reason || ''
    })
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
}
