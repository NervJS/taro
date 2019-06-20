import * as FileSystem from 'expo-file-system'

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

export {
  downloadFile
}

export default {
  downloadFile
}
