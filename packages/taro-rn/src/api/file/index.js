import { FileSystem } from 'expo'

export function downloadFile (opts) {
  if (typeof opts !== 'object') {
    const res = { errMsg: `fail parameter error: ${opts} should be Object` }
    return Promise.reject(res)
  }
  const { url, header, filePath, success, fail, complete } = opts
  let downloadResumable
  let p = new Promise((resolve, reject) => {
    let fileName = url.split('/')
    fileName = fileName[fileName.length - 1]
    const downloadFileCallback = (res) => {
      const { totalBytesWritten, totalBytesExpectedToWrite } = res
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

    downloadResumable.downloadAsync()
      .then((resp) => {
        const { uri, status } = resp
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

export default {
  downloadFile
}
