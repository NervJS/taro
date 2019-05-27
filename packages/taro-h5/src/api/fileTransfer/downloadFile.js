import { createCallbackManager } from '../utils'
import { NETWORK_TIMEOUT, setHeader, XHR_STATS } from './utils'

const createDownloadTask = ({ url, header, success, error }) => {
  let timeout
  const apiName = 'downloadFile'
  const xhr = new XMLHttpRequest()
  const callbackManager = {
    headersReceived: createCallbackManager(),
    progressUpdate: createCallbackManager()
  }

  xhr.open('GET', url, true)
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
    clearTimeout(timeout)
    error({
      errMsg: `${apiName}:fail abort`
    })
  }

  xhr.onerror = e => {
    error({
      errMsg: `${apiName}:fail ${e.message}`
    })
  }

  const send = () => {
    xhr.send()
    timeout = setTimeout(() => {
      xhr.onabort = null
      xhr.onload = null
      xhr.onprogress = null
      xhr.onreadystatechange = null
      xhr.onerror = null
      abort()
      error({
        errMsg: `${apiName}:fail timeout`
      })
    }, NETWORK_TIMEOUT)
  }

  send()

  /**
   * 中断任务
   */
  const abort = () => {
    xhr.abort()
  }

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
 * @todo 未挂载 task.offHeadersReceived
 * @todo 未挂载 task.offProgressUpdate
 * @param {Object} object 参数
 * @param {string} object.url 下载资源的 url
 * @param {Object} [object.header] HTTP 请求的 Header，Header 中不能设置 Referer
 * @param {string} [object.filePath] *指定文件下载后存储的路径
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 * @returns {DownloadTask}
 */
const downloadFile = ({ url, header, success, fail, complete }) => {
  let task
  const promise = new Promise((resolve, reject) => {
    task = createDownloadTask({
      url,
      header,
      success: res => {
        success && success(res)
        complete && complete()
        resolve(res)
      },
      error: res => {
        fail && fail(res)
        complete && complete()
        reject(res)
      }
    })
  })

  promise.headersReceive = task.onHeadersReceived
  promise.progress = task.onProgressUpdate
  promise.abort = task.abort

  return promise
}

export default downloadFile
