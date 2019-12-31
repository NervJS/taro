import { createCallbackManager } from '../utils'
import { convertObjectUrlToBlob, NETWORK_TIMEOUT, setHeader, XHR_STATS } from './utils'

const createUploadTask = ({ url, filePath, fileName, formData, name, header, success, error }) => {
  let timeout
  let formKey
  const apiName = 'uploadFile'
  const xhr = new XMLHttpRequest()
  const form = new FormData()
  const callbackManager = {
    headersReceived: createCallbackManager(),
    progressUpdate: createCallbackManager()
  }

  xhr.open('POST', url)
  setHeader(xhr, header)

  for (formKey in formData) {
    form.append(formKey, formData[formKey])
  }

  xhr.upload.onprogress = e => {
    const { loaded, total } = e
    callbackManager.progressUpdate.trigger({
      progress: Math.round(loaded / total * 100),
      totalBytesSent: loaded,
      totalBytesExpectedToSent: total
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
    success({
      errMsg: `${apiName}:ok`,
      statusCode: status,
      data: xhr.responseText || xhr.response
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
    xhr.send(form)
    timeout = setTimeout(() => {
      xhr.onabort = null
      xhr.onload = null
      xhr.upload.onprogress = null
      xhr.onreadystatechange = null
      xhr.onerror = null
      abort()
      error({
        errMsg: `${apiName}:fail timeout`
      })
    }, NETWORK_TIMEOUT)
  }

  convertObjectUrlToBlob(filePath)
    .then(fileObj => {
      form.append(name, fileObj, fileName || fileObj.name || `file-${Date.now()}`)
      send()
    })
    .catch(e => {
      error({
        errMsg: `${apiName}:fail ${e.message}`
      })
    })

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
 * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。使用前请注意阅读相关说明。
 * @param {Object} object 参数
 * @param {string} object.url 开发者服务器地址
 * @param {string} object.filePath 要上传文件资源的路径
 * @param {string} object.name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {string} [object.fileName] （仅H5）上传的文件名
 * @param {Object} [object.header] HTTP 请求 Header，Header 中不能设置 Referer
 * @param {Object} [object.formData] HTTP 请求中其他额外的 form data
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 * @returns {UploadTask}
 */
const uploadFile = ({ url, filePath, fileName, name, header, formData, success, fail, complete }) => {
  let task
  const promise = new Promise((resolve, reject) => {
    task = createUploadTask({
      url,
      header,
      name,
      filePath,
      formData,
      fileName,
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

export default uploadFile
