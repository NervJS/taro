import { document, window } from '@tarojs/runtime'
import Taro  from '@tarojs/taro'

const START_TIME = Date.now()

class Event {
  fns: any[] = []

  on (fn) {
    this.fns.push(fn)
  }

  off (fn) {
    this.fns = this.fns.filter(item => item !== fn)
  }

  tigger (...data) {
    this.fns.forEach(fn => fn(...data))
  }
}

class WebSocket {
  static CLOSED = 3
  static CLOSING = 2
  static CONNECTING = 0
  static OPEN = 1

  CLOSED = 3
  CLOSING = 2
  CONNECTING = 0
  OPEN = 1

  url = ''
  binaryType = 'blob'
  bufferedAmount = 0
  extensions = ''

  onopen = null
  onmessage = null
  onclose = null
  onerror = null

  private _miniappTask: Taro.SocketTask | null = null
  private _error: any | null = null
  private _waitEvent = new Event()
  private _events: { type: string, fn: any }[] = []

  _wait () {
    return new Promise<void>(resolve => {
      const fn = () => {
        resolve()
        this._waitEvent.off(fn)
      }

      if (this._miniappTask) {
        this._waitEvent.off(fn)
        return resolve()
      }

      if (this._error) {
        this._waitEvent.off(fn)
        return resolve()
      }

      this._waitEvent.on(fn)
    })
  }

  _execEvent (type, val) {
    const _val = {
      isTrusted: true,
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: this,
      defaultPrevented: false,
      eventPhase: 0,
      lastEventId: '',
      origin: this.url,
      ports: [],
      returnValue: true,
      source: null,
      srcElement: this,
      target: this,
      timeStamp: Date.now() - START_TIME,
      type,
      userActivation: null,
      wasClean: true,
      ...val,
    }

    this[`on${type}`](_val)
    this._events.forEach(item => item.type === type && item.fn(_val))
  }

  constructor (url) {
    this.url = url
    Taro.connectSocket({ url }).then(task => {
      task.onOpen(val => this._execEvent('open', val))

      task.onMessage(val => this._execEvent('message', val))

      task.onClose(val => this._execEvent('close', val))

      task.onError(val => this._execEvent('error', val))

      this._miniappTask = task
    }).catch(err => {
      this._error = err
    }).finally(() => {
      this._waitEvent.tigger()
    })
  }

  close (code, reason) {
    this._wait().then(() => {
      this._miniappTask?.close({ code, reason })
    })
  }

  send (data) {
    if (!this._miniappTask) {
      throw new Error(`Failed to execute 'send' on 'WebSocket': Still in CONNECTING state`)
    }
    this._miniappTask.send({ data })
  }

  addEventListener (type, fn) {
    this._events.push({ type, fn })
  }

  removeEventListener (type, fn) {
    this._events = this._events.filter(item => item.type === type && item.fn === fn)
  }
}

class _WebSocket {
  constructor (url) {
    const socket = new WebSocket(url)
    Object.defineProperties(
      socket,
      ['onopen', 'onerror', 'onmessage', 'onclose'].reduce((p, c) => ({
        ...p,
        [c]: {
          set (value) {
            socket._wait().then(() => {
              this[`_${c}`] = value
            })
          },
          get () {
            return this[`_${c}`]
          },
        },
      }), {}),
    )

    return socket
  }
}

window.WebSocket = _WebSocket

export { document, _WebSocket as WebSocket }
