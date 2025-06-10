import Taro from '@tarojs/api'

import { CallbackManager } from '../../utils/handler'
import { NETWORK_TIMEOUT, setHeader, XHR_STATS } from './utils'

const createDownloadTask = ({ url, header, withCredentials = true, timeout, success, error }): Taro.DownloadTask => {
  let timeoutInter: ReturnType<typeof setTimeout>
  const apiName = 'downloadFile'
  const xhr = new XMLHttpRequest()
  const callbackManager = {
    headersReceived: new CallbackManager(),
    progressUpdate: new CallbackManager()
  }

  xhr.open('GET', url, true)
  xhr.withCredentials = !!withCredentials
  xhr.responseType = 'blob'
  setHeader(xhr, header)

  xhr.onprogress = e => {
    const { loaded, total } = e
    callbackManager.progressUpdate.trigger({
      progress: Math.round(loaded / total * 100),
      totalBytesWritten: loaded,
      totalBytesExpectedToWrite: total
    })
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XHR_STATS.HEADERS_RECEIVED) return
    callbackManager.headersReceived.trigger({
      header: xhr.getAllResponseHeaders()
    })
  }

  xhr.onload = () => {
    const response = xhr.response
    const status = xhr.status
    success({
      errMsg: `${apiName}:ok`,
      statusCode: status,
      tempFilePath: window.URL.createObjectURL(response)
    })
  }

  xhr.onabort = () => {
    clearTimeout(timeoutInter)
    error({
      errMsg: `${apiName}:fail abort`
    })
  }

  xhr.onerror = (e: ProgressEvent<EventTarget> & { message?: string }) => {
    error({
      errMsg: `${apiName}:fail ${e.message}`
    })
  }

  /**
   * 中断任务
   */
  const abort = () => {
    xhr.abort()
  }

  const send = () => {
    xhr.send()
    timeoutInter = setTimeout(() => {
      xhr.onabort = null
      xhr.onload = null
      xhr.onprogress = null
      xhr.onreadystatechange = null
      xhr.onerror = null
      abort()
      error({
        errMsg: `${apiName}:fail timeout`
      })
    }, timeout || NETWORK_TIMEOUT)
  }

  send()

  /**
   * 监听 HTTP Response Header 事件。会比请求完成事件更早
   * @param {HeadersReceivedCallback} callback HTTP Response Header 事件的回调函数
   */
  const onHeadersReceived = callbackManager.headersReceived.add
  /**
   * 取消监听 HTTP Response Header 事件
   * @param {HeadersReceivedCallback} callback HTTP Response Header 事件的回调函数
   */
  const offHeadersReceived = callbackManager.headersReceived.remove

  /**
   * 监听进度变化事件
   * @param {ProgressUpdateCallback} callback HTTP Response Header 事件的回调函数
   */
  const onProgressUpdate = callbackManager.progressUpdate.add
  /**
   * 取消监听进度变化事件
   * @param {ProgressUpdateCallback} callback HTTP Response Header 事件的回调函数
   */
  const offProgressUpdate = callbackManager.progressUpdate.remove

  return {
    abort,
    onHeadersReceived,
    offHeadersReceived,
    onProgressUpdate,
    offProgressUpdate
  }
}

/**
 * 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径。使用前请注意阅读相关说明。
 * 注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。
 */
export const downloadFile: typeof Taro.downloadFile = ({ url, header, withCredentials, timeout, success, fail, complete }) => {
  let task!: Taro.DownloadTask
  const result: ReturnType<typeof Taro.downloadFile> = new Promise((resolve, reject) => {
    task = createDownloadTask({
      url,
      header,
      withCredentials,
      timeout,
      success: res => {
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      error: res => {
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  }) as any

  result.headersReceive = task.onHeadersReceived.bind(task)
  result.progress = task.onProgressUpdate.bind(task)

  const properties = {}
  Object.keys(task).forEach(key => {
    properties[key] = {
      get () {
        return typeof task[key] === 'function' ? task[key].bind(task) : task[key]
      }
    }
  })
  return Object.defineProperties(result, properties)
}
