import Taro from '@tarojs/api'

import { CallbackManager } from '../../utils/handler'
import {
  convertObjectUrlToBlob,
  NETWORK_TIMEOUT,
  setHeader,
  XHR_STATS
} from './utils'

const createUploadTask = ({ url, filePath, formData = {}, name, header, timeout, fileName, withCredentials = true, success, error }): Taro.UploadTask => {
  let timeoutInter: ReturnType<typeof setTimeout>
  let formKey
  const apiName = 'uploadFile'
  const xhr = new XMLHttpRequest()
  const form = new FormData()
  const callbackManager = {
    headersReceived: new CallbackManager(),
    progressUpdate: new CallbackManager()
  }

  xhr.open('POST', url)
  xhr.withCredentials = !!withCredentials
  setHeader(xhr, header)

  for (formKey in formData) {
    form.append(formKey, formData[formKey])
  }

  xhr.upload.onprogress = e => {
    const { loaded, total } = e
    callbackManager.progressUpdate.trigger({
      progress: Math.round(loaded / total * 100),
      totalBytesSent: loaded,
      totalBytesExpectedToSend: total
    })
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XHR_STATS.HEADERS_RECEIVED) return
    callbackManager.headersReceived.trigger({
      header: xhr.getAllResponseHeaders()
    })
  }

  xhr.onload = () => {
    const status = xhr.status
    clearTimeout(timeoutInter)
    success({
      errMsg: `${apiName}:ok`,
      statusCode: status,
      data: xhr.responseText || xhr.response
    })
  }

  xhr.onabort = () => {
    clearTimeout(timeoutInter)
    error({
      errMsg: `${apiName}:fail abort`
    })
  }

  xhr.onerror = (e: ProgressEvent<EventTarget> & { message?: string }) => {
    clearTimeout(timeoutInter)
    error({
      errMsg: `${apiName}:fail ${e.message}`
    })
  }

  /**
   * 中断任务
   */
  const abort = () => {
    clearTimeout(timeoutInter)
    xhr.abort()
  }

  const send = () => {
    xhr.send(form)
    timeoutInter = setTimeout(() => {
      xhr.onabort = null
      xhr.onload = null
      xhr.upload.onprogress = null
      xhr.onreadystatechange = null
      xhr.onerror = null
      abort()
      error({
        errMsg: `${apiName}:fail timeout`
      })
    }, timeout || NETWORK_TIMEOUT)
  }

  convertObjectUrlToBlob(filePath)
    .then((fileObj: string | (Blob & { name?: string })) => {
      if (!fileName) {
        fileName = typeof fileObj !== 'string' && fileObj.name
      }
      form.append(name, fileObj, fileName || `file-${Date.now()}`)
      send()
    })
    .catch(e => {
      error({
        errMsg: `${apiName}:fail ${e.message}`
      })
    })

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
 * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。使用前请注意阅读相关说明。
 */
export const uploadFile: typeof Taro.uploadFile = ({ url, filePath, name, header, formData, timeout, fileName,withCredentials, success, fail, complete }) => {
  let task!: Taro.UploadTask
  const result: ReturnType<typeof Taro.uploadFile> = new Promise((resolve, reject) => {
    task = createUploadTask({
      url,
      header,
      name,
      filePath,
      formData,
      timeout,
      fileName,
      withCredentials,
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
