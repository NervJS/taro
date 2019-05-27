/**
 * HTTP Response Header 事件回调函数的参数
 * @typedef {Object} HeadersReceivedParam
 * @property {Object} header 开发者服务器返回的 HTTP Response Header
 */

/**
 * HTTP Response Header 事件的回调函数
 * @callback HeadersReceivedCallback
 * @param {HeadersReceivedParam} res 参数
 */

/**
 * 进度变化回调函数的参数
 * @typedef {Object} ProgressUpdateParam
 * @property {number} progress 进度百分比
 * @property {number} [totalBytesWritten] 已经下载的数据长度，单位 Bytes
 * @property {number} [totalBytesSent] 已经上传的数据长度，单位 Bytes
 * @property {number} [totalBytesExpectedToWrite] 预期需要下载的数据总长度，单位 Bytes
 * @property {number} [totalBytesExpectedToSend] 预期需要上传的数据总长度，单位 Bytes
 */

/**
 * 进度变化事件的回调函数
 * @callback ProgressUpdateCallback
 * @param {ProgressUpdateParam} res 参数
 */

export const NETWORK_TIMEOUT = 60000

export const XHR_STATS = {
  UNSENT: 0, // Client has been created. open() not called yet.
  OPENED: 1, // open() has been called.
  HEADERS_RECEIVED: 2, // send() has been called, and headers and status are available.
  LOADING: 3, // Downloading; responseText holds partial data.
  DONE: 4 // The operation is complete.
}

/**
 * 设置xhr的header
 * @param {XMLHttpRequest} xhr
 * @param {Object} header
 */
export const setHeader = (xhr, header) => {
  let headerKey
  for (headerKey in header) {
    xhr.setRequestHeader(headerKey, header[headerKey])
  }
}

/**
 * 将 blob url 转化为文件
 * @param {string} url 要转换的 blob url
 * @returns {Promise<File>}
 */
export const convertObjectUrlToBlob = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        /* eslint-disable prefer-promise-reject-errors */
        reject({ status: this.status })
      }
    }
    xhr.send()
  })
}
