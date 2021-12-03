// ✅ wx.downloadFile
// ✅ DownloadTask.abort
// ❌ DownloadTask.offHeadersReceived 此接口 ohos 不支持
// ✅ DownloadTask.offProgressUpdate
// ❌ DownloadTask.onHeadersReceived 此接口 ohos 不支持
// ✅ DownloadTask.onProgressUpdate

import Taro, { DownloadTask } from '@tarojs/taro'
import { validateParams, callAsyncFail, callAsyncSuccess } from '../utils'
const request = require('@ohos.request')

type DownloadFile = typeof Taro.downloadFile

interface IDownloadConfigOHOS {
  url: string
  header?: TaroGeneral.IAnyObject
  filePath?: string
  enableMetered?: boolean // ohos参数
  enableRoaming?: boolean // ohos参数
  description?: string // ohos参数
  networkType?: number // ohos参数
  title?: string // ohos参数
}

const downloadFileSchema = {
  url: 'String'
}

// TODO: 增加函数类型
const downloadFile: DownloadFile = function (options) {
  let downloadTask: TaroGeneral.IAnyObject = {}

  const downloadTaskWX: any = new Promise((resolve, reject) => {
    const { url, header, filePath } = options

    try {
      validateParams('downloadFile', options, downloadFileSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    console.warn('ddoowwnnllooaadd url: ' + options.url)

    const ohosParams: IDownloadConfigOHOS = {
      url
    }
    if (header) ohosParams.header = header
    if (filePath) ohosParams.filePath = filePath

    request.download(ohosParams).then((dataDownload:any) => {
      console.warn('ddoowwnnllooaadd requestDownload TARO 1 download')
      downloadTask = dataDownload
      let downloadData
      console.warn('ddoowwnnllooaadd requestDownload TARO 2 download')

      downloadTask.query().then(dataQuery => {
        console.warn('ddoowwnnllooaadd requestDownload TARO 3 query')
        downloadData = dataQuery
        downloadTask.on('complete', () => {
          console.warn('ddoowwnnllooaadd requestDownload TARO 4 complete')
          callAsyncSuccess(resolve, downloadData, options)
        })
        downloadTask.on('fail', (err) => {
          console.warn('ddoowwnnllooaadd requestDownload TARO 5 fail |||' + JSON.stringify(err))
          const res = {
            errMsg: 'ddoowwnnllooaadd' + err
          }
          callAsyncFail(reject, res, options)
        })
      }).catch((err) => {
        callAsyncFail(reject, err, options)
        console.warn('ddoowwnnllooaadd Failed to query the download task. Cause:' + err)
      })
    }).catch((err) => {
      callAsyncFail(reject, err, options)
    })
  })
  downloadTaskWX.abort = function () {
    console.warn('ddoowwnnllooaadd abort begin：')
    downloadTask.remove((err: any, data: any) => {
      if (err) {
        console.error('ddoowwnnllooaadd Failed to remove the download task. Cause:' + err + '|||' + downloadTask)
        return
      }
      console.warn('ddoowwnnllooaadd Download task removed.' + data)
    })
  }
  downloadTaskWX.offProgressUpdate = function offProgressUpdate (callback: DownloadTask.OffProgressUpdateCallback) {
    console.warn('ddoowwnnllooaadd OFF offProgressUpdate progress begin：')
    validateParams('offProgressUpdate', [callback], ['Function'])
    downloadTask.off('progress', (err, _data) => {
      const res: TaroGeneral.CallbackResult = {
        errMsg: err ? 'Cancel progress listening is failed. Cause:' + err : 'Cancel progress listening is done.'
      }
      err ? callback(err) : callback(res)
    })
  }
  downloadTaskWX.onProgressUpdate = function (callback: DownloadTask.OnProgressUpdateCallback) {
    console.warn('ddoowwnnllooaadd ON onProgressUpdate progress begin：')
    validateParams('onProgressUpdate', [callback], ['Function'])
    downloadTask.on('progress', (receivedSize: number, totalSize: number) => {
      console.warn('ddoowwnnllooaadd ON onProgressUpdate totalSize:' + totalSize + '，  receivedSize:' + receivedSize)
      const totalBytesWritten: number = receivedSize * 1024
      const totalBytesExpectedToWrite: number = totalSize * 1024
      // TODO: 应该保留几位小数？
      const progress: number = +(receivedSize / totalSize).toFixed(6)
      const progressParams: DownloadTask.OnProgressUpdateCallbackResult = {
        totalBytesWritten,
        totalBytesExpectedToWrite,
        progress
      }
      callback(progressParams)
    })
  }
  return downloadTaskWX
}

export {
  downloadFile
}
