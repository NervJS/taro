import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'

const createFormData = (file, body, name) => {
  const data = new FormData()

  data.append(name, {
    name: file.fileName,
    type: file.type,
    uri:
      Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '')
  })

  Object.keys(body).forEach(key => {
    data.append(key, body[key])
  })

  return data
}

/**
 * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。
 * @param {object} opts
 * @param {string} opts.url - 开发者服务器地址
 * @param {string} opts.filePath - 要上传文件资源的路径
 * @param {string} opts.name - 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {object} [opts.header] - HTTP 请求 Header，Header 中不能设置 Referer
 * @param {object} [opts.formData] - HTTP 请求中其他额外的 form data
 * @return UploadTask - 一个可以监听上传进度进度变化的事件和取消上传的对象
 */
function uploadFile (opts = {}) {
  const {url, filePath, name, header, formData, success, fail, complete} = opts
  return fetch(url, {
    method: 'POST',
    body: createFormData(filePath, formData, name),
    headers: header
  }).then(res => {
    if (res.ok) {
      console.log(res)
      success && success(res)
      complete && complete(res)
      return res.json()
    } else {
      console.log(res)
      const errMsg = `uploadFile fail: ${res.status} ${res.statusText}`
      fail && fail({errMsg})
      complete && complete({errMsg})
      return Promise.reject(new Error(errMsg))
    }
  }).catch(e => {
    const errMsg = `uploadFile fail: ${e}`
    fail && fail({errMsg})
    complete && complete({errMsg})
    return Promise.reject(new Error(errMsg))
  })
}

/**
 * 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径，单次下载允许的最大文件为 50MB。
 * @param opts
 * @param {string} opts.url - 下载资源的 url
 * @param {Object} [opts.header] - HTTP 请求的 Header，Header 中不能设置 Referer
 * @param {string} [opts.filePath] - 指定文件下载后存储的路径
 * @returns {*}
 */
function downloadFile (opts = {}) {
  if (typeof opts !== 'object') {
    const res = {errMsg: `fail parameter error: ${opts} should be Object`}
    return Promise.reject(res)
  }
  const {url, header, filePath, success, fail, complete} = opts
  let downloadResumable
  let p = new Promise((resolve, reject) => {
    let fileName = url.split('/')
    fileName = fileName[fileName.length - 1]
    const downloadFileCallback = (res) => {
      const {totalBytesWritten, totalBytesExpectedToWrite} = res
      let progress = totalBytesWritten / totalBytesExpectedToWrite * 100
      progress = Number(progress.toFixed(2))
      p.onProgressUpdateCb && p.onProgressUpdateCb({
        progress,
        totalBytesWritten,
        totalBytesExpectedToWrite
      })
    }
    downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath || `${FileSystem.documentDirectory}${fileName}`,
      {
        headers: header
      },
      downloadFileCallback
    )

    downloadResumable.downloadAsync().then((resp) => {
      const {uri, status} = resp
      const res = {
        tempFilePath: uri,
        statusCode: status
      }
      success && success(res)
      complete && complete(res)
      resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: `download file fail`,
        err
      }
      fail && fail(res)
      complete && complete(res)
      reject(res)
    })
  })

  p.onProgressUpdate = (cb) => {
    if (cb) {
      p.onProgressUpdateCb = cb
    }
  }

  p.abort = (cb) => {
    downloadResumable.pauseAsync()
    cb && cb()
  }

  return p
}

export * from './file-system'

export {
  downloadFile,
  uploadFile
}
