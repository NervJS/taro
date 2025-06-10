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
          if (res.data.includes('"event":"highlightNativeElement"')) {
            // 元素高亮暂时不实现，需要魔改 backend 的代码
            return
          }
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

  public close (code, reason) {
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
