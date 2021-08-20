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
