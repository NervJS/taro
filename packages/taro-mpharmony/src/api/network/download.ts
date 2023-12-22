import Taro from '@tarojs/api'

import { CallbackManager } from '../../utils/handler'
import { NETWORK_TIMEOUT, setHeader, XHR_STATS } from './utils'


const splitHeaders = (headers: string) => {
  const arr = headers.trim().split(/[\r\n]+/)
  const headerMap = {}
  arr.forEach((line) => {
    const parts = line.split(': ')
    if (parts.length === 2) {
      headerMap[parts[0]] = parts[1]
    }
  })
  return headerMap
}

const createDownloadTask = ({ url, header, filePath, withCredentials = true, timeout, success, error }): Taro.DownloadTask => {
  let timeoutInter: ReturnType<typeof setTimeout>
  let totalData = 0
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
    totalData = total
    callbackManager.progressUpdate.trigger({
      progress: Math.round(loaded / total * 100),
      totalBytesWritten: loaded,
      totalBytesExpectedToWrite: total
    })
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XHR_STATS.HEADERS_RECEIVED) return
    callbackManager.headersReceived.trigger({
      header: splitHeaders(xhr.getAllResponseHeaders())
    })
  }

  xhr.onload = () => {
    const response = xhr.response
    const status = xhr.status
    const reader = new FileReader()
    reader.onload = () => {
      clearTimeout(timeoutInter)
      const base64Data = reader.result as string
      // @ts-ignore
      native .saveDataUrlToFile({
        filePath,
        url,
        data: base64Data,
        success: (res) => {
          const resData = {
            errMsg: `${apiName}:ok`,
            statusCode: status,
            tempFilePath: res.tempFilePath,
            dataLength: totalData,
            header: splitHeaders(xhr.getAllResponseHeaders()),
            cookies: [],
          }
          filePath && Object.assign(resData, { filePath })
          success(resData)
        },
        fail: (res) => {
          error({
            errMsg: `${apiName}:fail ${res.errMsg}`
          })
        }
      })
    }
    reader.readAsDataURL(response)
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

/**
 * 下载文件资源到本地
 * 
 * @canUse downloadFile
 * @__object [url, filePath, header, timeout, withCredentials]
 * @__success [filePath, statusCode, tempFilePath, header, dataLength, cookies, profile]
 */
export const downloadFile: typeof Taro.downloadFile = ({ url, header, filePath, withCredentials, timeout, success, fail, complete }) => {
  let task!: Taro.DownloadTask
  const result: ReturnType<typeof Taro.downloadFile> = new Promise((resolve, reject) => {
    task = createDownloadTask({
      url,
      header,
      filePath,
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

  result.headersReceive = task.onHeadersReceived
  result.progress = task.onProgressUpdate

  return new Proxy(result, {
    get (target, prop) {
      const object = prop in task ? task : target
      const value = object[prop]
      return typeof value === 'function' ? value.bind(object) : value
    },
  })
}
