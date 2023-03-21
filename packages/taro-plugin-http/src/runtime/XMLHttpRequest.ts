import { Events, parseUrl, window } from '@tarojs/runtime'
import { isFunction, isString } from '@tarojs/shared'
import { request } from '@tarojs/taro'

declare const ENABLE_COOKIE: boolean

const SUPPORT_METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']
const STATUS_TEXT_MAP = {
  100: 'Continue',
  101: 'Switching protocols',

  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',

  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',

  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Suitable',
  417: 'Expectation Failed',

  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
}
// https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
export class XMLHttpRequest extends Events {
  static readonly UNSENT = 0
  static readonly OPENED = 1
  static readonly HEADERS_RECEIVED = 2
  static readonly LOADING = 3
  static readonly DONE = 4

  // 欺骗一些库让其认为是原生的xhr
  static toString () {
    return 'function XMLHttpRequest() { [native code] }'
  }

  toString () {
    return '[object XMLHttpRequest]'
  }

  #method: string
  #url: string
  #data: null
  #status: number
  #statusText: string
  #readyState: number
  #header: Record<string, any>
  #responseType: string
  #resHeader: null | Record<string, any>
  #response: null
  #timeout: number
  #withCredentials: boolean
  #requestTask: null | Taro.RequestTask<any>

  // 事件

  /** 当 request 被停止时触发，例如当程序调用 XMLHttpRequest.abort() 时 */
  onabort: (() => void) | null = null

  /** 当 request 遭遇错误时触发 */
  onerror: ((err: any) => void) | null = null

  /** 接收到响应数据时触发 */
  onloadstart: (() => void) | null = null

  /** 请求成功完成时触发 */
  onload: (() => void) | null = null

  /** 当请求结束时触发，无论请求成功 ( load) 还是失败 (abort 或 error)。 */
  onloadend: (() => void) | null = null

  /** 在预设时间内没有接收到响应时触发 */
  ontimeout: (() => void) | null = null

  /** 当 readyState 属性发生变化时，调用的事件处理器 */
  onreadystatechange: (() => void) | null = null

  constructor () {
    super()

    this.#method = ''
    this.#url = ''
    this.#data = null
    this.#status = 0
    this.#statusText = ''
    this.#readyState = XMLHttpRequest.UNSENT
    this.#header = {
      Accept: '*/*',
    }
    this.#responseType = ''
    this.#resHeader = null
    this.#response = null
    this.#timeout = 0
    /** 向前兼容，默认为 true */
    this.#withCredentials = true

    this.#requestTask = null
  }

  addEventListener (event: string, callback: (arg: any) => void) {
    if (!isString(event)) return
    this.on(event, callback, null)
  }

  removeEventListener (event: string, callback: (arg: any) => void) {
    if (!isString(event)) return
    this.off(event, callback, null)
  }

  /**
   * readyState 变化
   */
  #callReadyStateChange (readyState) {
    const hasChange = readyState !== this.#readyState
    this.#readyState = readyState

    if (hasChange) {
      this.trigger('readystatechange')
      isFunction(this.onreadystatechange) && this.onreadystatechange()
    }
  }

  /**
   * 执行请求
   */
  #callRequest () {
    if (!window || !window.document) {
      console.warn('this page has been unloaded, so this request will be canceled.')
      return
    }

    if (this.#timeout) {
      setTimeout(() => {
        if (!this.#status && this.#readyState !== XMLHttpRequest.DONE) {
          // 超时
          if (this.#requestTask) this.#requestTask.abort()
          this.#callReadyStateChange(XMLHttpRequest.DONE)
          this.trigger('timeout')
          isFunction(this.ontimeout) && this.ontimeout()
        }
      }, this.#timeout)
    }

    // 重置各种状态
    this.#status = 0
    this.#statusText = ''
    this.#readyState = XMLHttpRequest.OPENED
    this.#resHeader = null
    this.#response = null

    // 补完 url
    let url = this.#url
    url = url.indexOf('//') === -1 ? window.location.origin + url : url

    // 头信息
    const header = Object.assign({}, this.#header)
    header.cookie = window.document.cookie
    if (!this.withCredentials) {
      // 不同源，要求 withCredentials 为 true 才携带 cookie
      const { origin } = parseUrl(url)
      if (origin !== window.location.origin) delete header.cookie
    }
    this.#requestTask = request({
      url,
      data: this.#data || {},
      header,
      // @ts-ignore
      method: this.#method,
      dataType: this.#responseType === 'json' ? 'json' : 'text',
      responseType: this.#responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
      success: this.#requestSuccess.bind(this),
      fail: this.#requestFail.bind(this),
      complete: this.#requestComplete.bind(this),
    })
  }

  /**
   * 请求成功
   */
  #requestSuccess ({ data, statusCode, header }) {
    if (!window || !window.document) {
      console.warn('this page has been unloaded, so this request will be canceled.')
      return
    }

    this.#status = statusCode
    this.#resHeader = header

    this.#callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED)

    if (ENABLE_COOKIE) {
      // 处理 set-cookie
      const setCookieStr = header['Set-Cookie']

      if (setCookieStr && typeof setCookieStr === 'string') {
        let start = 0
        let startSplit = 0
        let nextSplit = setCookieStr.indexOf(',', startSplit)
        const cookies: string[] = []

        while (nextSplit >= 0) {
          const lastSplitStr = setCookieStr.substring(start, nextSplit)
          const splitStr = setCookieStr.substr(nextSplit)

          // eslint-disable-next-line no-control-regex
          if (/^,\s*([^,=;\x00-\x1F]+)=([^;\n\r\0\x00-\x1F]*).*/.test(splitStr)) {
            // 分割成功，则上一片是完整 cookie
            cookies.push(lastSplitStr)
            start = nextSplit + 1
          }

          startSplit = nextSplit + 1
          nextSplit = setCookieStr.indexOf(',', startSplit)
        }

        // 塞入最后一片 cookie
        cookies.push(setCookieStr.substr(start))

        cookies.forEach((cookie) => {
          window.document.cookie = cookie
        })
      }
    }

    // 处理返回数据
    if (data) {
      this.#callReadyStateChange(XMLHttpRequest.LOADING)
      this.trigger('loadstart')
      isFunction(this.onloadstart) && this.onloadstart()
      this.#response = data
      this.trigger('load')
      isFunction(this.onload) && this.onload()
    }
  }

  /**
   * 请求失败
   */
  #requestFail (err) {
    this.#status = 0
    this.#statusText = err.errMsg
    this.trigger('error')
    isFunction(this.onerror) && this.onerror(err)
  }

  /**
   * 请求完成
   */
  #requestComplete () {
    this.#requestTask = null
    this.#callReadyStateChange(XMLHttpRequest.DONE)

    if (this.#status) {
      this.trigger('loadend')
      isFunction(this.onloadend) && this.onloadend()
    }
  }

  /**
   * 对外属性和方法
   */
  get timeout () {
    return this.#timeout
  }

  set timeout (timeout) {
    if (typeof timeout !== 'number' || !isFinite(timeout) || timeout <= 0) return

    this.#timeout = timeout
  }

  get status () {
    return this.#status
  }

  get statusText () {
    if (this.#readyState === XMLHttpRequest.UNSENT || this.#readyState === XMLHttpRequest.OPENED) return ''

    return STATUS_TEXT_MAP[this.#status + ''] || this.#statusText || ''
  }

  get readyState () {
    return this.#readyState
  }

  get responseType () {
    return this.#responseType
  }

  set responseType (value) {
    if (typeof value !== 'string') return

    this.#responseType = value
  }

  get responseText () {
    if (!this.#responseType || this.#responseType === 'text') {
      return this.#response
    }

    return null
  }

  get response () {
    return this.#response
  }

  get withCredentials () {
    return this.#withCredentials
  }

  set withCredentials (value) {
    this.#withCredentials = !!value
  }

  abort () {
    if (this.#requestTask) {
      this.#requestTask.abort()
      this.trigger('abort')
      isFunction(this.onabort) && this.onabort()
    }
  }

  getAllResponseHeaders () {
    if (this.#readyState === XMLHttpRequest.UNSENT || this.#readyState === XMLHttpRequest.OPENED || !this.#resHeader)
      return ''

    return Object.keys(this.#resHeader)
      .map((key) => `${key}: ${this.#resHeader![key]}`)
      .join('\r\n')
  }

  getResponseHeader (name) {
    if (this.#readyState === XMLHttpRequest.UNSENT || this.#readyState === XMLHttpRequest.OPENED || !this.#resHeader)
      return null

    // 处理大小写不敏感
    const key = Object.keys(this.#resHeader).find((item) => item.toLowerCase() === name.toLowerCase())
    const value = key ? this.#resHeader[key] : null

    return typeof value === 'string' ? value : null
  }

  open (method, url) {
    if (typeof method === 'string') method = method.toUpperCase()

    if (SUPPORT_METHOD.indexOf(method) < 0) return
    if (!url || typeof url !== 'string') return

    this.#method = method
    this.#url = url

    this.#callReadyStateChange(XMLHttpRequest.OPENED)
  }

  setRequestHeader (header, value) {
    if (typeof header === 'string' && typeof value === 'string') {
      this.#header[header] = value
    }
  }

  send (data) {
    if (this.#readyState !== XMLHttpRequest.OPENED) return

    this.#data = data
    this.#callRequest()
  }
}
