const axios = require('axios').default

const CancelToken = axios.CancelToken
const source = CancelToken.source()

const errMsgMap = new Map([
  [401, 'Parameter error'],
  [201, 'Permission denied'],
  [3, 'URL using bad/illegal format or missing URL'],
  [7, "Couldn't connect to server"],
  [23, 'Failed writing received data to disk/application'],
  [25, 'Upload failed'],
  [26, 'Failed to open/read local data from file/application'],
  [28, 'Timeout was reached'],
  [73, 'Remote file already exists'],
  [78, 'Remote file not found'],
  [999, 'Unknown Other Error'],
])

export class RequestTask {
  public responseHeader
  public abortFlag
  public fail
  public complete
  public headersCallback
  public result
  public res
  public interceptor
  public httpRequest

  constructor (object) {
    const { url, headers, method, timeout, responseType, enableCache } = object || {}
    let { data } = object || {}
    const { success, fail, complete, dataType } = object || {}

    this.responseHeader = null
    this.abortFlag = false
    this.fail = fail
    this.complete = complete
    this.headersCallback = new Set()
    // 使用axios.create来创建axios实例
    this.httpRequest = axios.create({
      responseType: responseType || 'text',
      headers: headers,
      timeout: timeout || 2000,
    })

    // 请求拦截器
    this.httpRequest.interceptors.request.use(
      (config) => {
        if (config.enableCache === false) {
          return config
        }
        // 处理缓存
        const cacheData = localStorage.getItem(config.url)
        if (cacheData !== null) {
          let result = cacheData
          if (dataType === 'json') {
            result = JSON.parse(cacheData)
          }
          source.cancel('cache has useful data!!')
          return Promise.resolve({ result })
        }
        return config
      },
      (error) => {
        console.error('error: ', error)
      }
    )

    // 响应拦截器
    this.httpRequest.interceptors.response.use(
      (response) => {
        // 缓存数据
        if (response.config.enableCache === false) {
          localStorage.setItem(response.config.url, JSON.stringify(response.data))
        }
        return response
      },
      (error) => {
        console.error('error: ', error)
      }
    )

    if (!object) {
      console.error('request error: params illegal')
      return
    }

    let isFormUrlEncoded = false
    for (const key in headers) {
      if (key.toLowerCase() === 'content-type') {
        if (headers[key].toLowerCase().includes('application/x-www-form-urlencoded')) {
          isFormUrlEncoded = true
        }
        break
      }
    }

    // data为Object类型时，属性的值类型如果是number, request请求时信息会丢失. 故将data转成string类型进行规避
    if (data && (isFormUrlEncoded || ['GET', 'OPTIONS', 'DELETE', 'TRACE', 'CONNECT'].includes(method))) {
      const dataArray = []
      for (const key in data) {
        // @ts-ignore
        dataArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
      data = dataArray.join('&')
    }

    // header的属性的值类型如果是number, request请求时信息会丢失. 故将各个属性转成string类型
    if (headers) {
      for (const key in headers) {
        headers[key] = `${headers[key]}`
      }
    }

    this.httpRequest({
      method: method,
      url: url,
      CancelToken: source.token,
      enableCache: enableCache || false,
    })
      .then((response) => {
        if (success && !this.abortFlag) {
          this.responseHeader = response.headers
          let result = response.result
          if (response.config.responseType === 'text') {
            if (dataType === 'text') {
              result = response.data
            } else if (dataType === 'json') {
              result = JSON.parse(response.data)
            } else if (dataType === 'base64') {
              const encodeData = encodeURIComponent(response.data)
              result = btoa(encodeData)
            } else if (dataType === 'arraybuffer') {
              result = new TextEncoder().encode(response.data).buffer
            } else {
              console.error('Unsupported dataType!!')
            }
          } else if (response.config.responseType === 'arraybuffer') {
            result = response.data
          } else {
            console.error('Unsupported dataType!!: ', response.config.responseType)
          }
          const res = {
            data: result,
            statusCode: response.status,
            header: response.headers,
            cookies: response.cookies ? [response.cookies] : [],
            errMsg: 'request:ok',
          }
          this.result = res
          success(res)
        }
      })
      .catch((err) => {
        console.error('request error: ' + JSON.stringify(err))
        if (fail && !this.abortFlag) {
          // eslint-disable-next-line no-console
          const res = { errMsg: errMsgMap.has(err.code) ? errMsgMap.get(err.code) : `${JSON.stringify(err)}` }
          this.result = res
          fail(res)
        }
      })
      .finally(() => {
        if (complete && !this.abortFlag) {
          complete(this.result)
        }
        if (this.httpRequest) {
          source.cancel('requestTask cancelled by the user!')
        }
      })
  }

  /**
   * interrupt request task
   */
  abort () {
    this.abortFlag = true
    if (this.httpRequest) {
      source.cancel('requestTask cancelled by the user!')
      this.res = { errMsg: 'request:fail abort' }
      this.fail && this.fail(this.res)
      this.complete && this.complete(this.res)
    }
  }

  onHeadersReceived (callback) {
    if (!callback) {
      console.error('[AdvancedAPI] Invalid, callback is null')
      return
    }
    const taskCallback = (header) => {
      !this.abortFlag && callback({ header })
    }
    if (!this.headersCallback.has(callback)) {
      this.headersCallback.add(taskCallback)
      if (this.httpRequest) {
        this.interceptor = this.httpRequest.interceptors.response.use((response) => {
          taskCallback(this.responseHeader)
          return response
        })
      }
      taskCallback(this.responseHeader)
    }
  }

  /**
   * unsubscribe HTTP Response Header event
   * remove all if callback is null, otherwise remove the specialized callback
   */
  offHeadersReceived (callback) {
    if (this.headersCallback.has(callback)) {
      if (this.httpRequest) {
        this.httpRequest.interceptors.eject(this.interceptor)
      }
      this.headersCallback.delete(callback)
    } else {
      // eslint-disable-next-line no-console
      console.debug('offHeadersReceived callback invalid')
    }
  }
}
