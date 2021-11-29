// ✅ wx.downloadFile
// ✅ DownloadTask.abort
// ❌ DownloadTask.offHeadersReceived 此接口 ohos 不支持
// ✅ DownloadTask.offProgressUpdate
// ❌ DownloadTask.onHeadersReceived 此接口 ohos 不支持
// ✅ DownloadTask.onProgressUpdate

import { DownloadTask } from '@tarojs/taro'
import { validateOptions } from './validate'
import { callAsyncFail, callAsyncSuccess } from '../utils'
const request = require('@ohos.request')

// type DownloadFile = typeof Taro.downloadFile

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

// TODO: 增加函数类型
const downloadFile = function (options) {
  return new Promise((resolve, reject) => {
    const { url, header, filePath } = options
    const requiredParamsValue: Array<any> = [url]
    const requiredParamsName: Array<string> = ['url']
    const requiredParamsType: Array<string> = ['string']
    const { res, isPassed } = validateOptions('downloadFile', options, requiredParamsValue, requiredParamsType, requiredParamsName)
    if (!isPassed) {
      callAsyncFail(reject, res, options)
      return
    }

    let downloadTask: TaroGeneral.IAnyObject = {}
    const DownloadTaskWX: DownloadTask = {
      abort: function () {
        // console.warn('ddoowwnnllooaadd abort begin：' + downloadTask.remove)
        downloadTask.remove((err: any, data: any) => {
          if (err) {
            console.error('Failed to remove the download task. Cause:' + err + '|||' + JSON.stringify(downloadTask))
            return
          }
          console.warn('Download task removed.' + data + '|||' + JSON.stringify(downloadTask))
        })
      },
      offProgressUpdate: function offProgressUpdate (callback: DownloadTask.OffProgressUpdateCallback) {
        // console.warn('ddoowwnnllooaadd OFF offProgressUpdate progress begin：' + downloadTask.on)
        downloadTask.off('progress', (err, _data) => {
          const res: TaroGeneral.CallbackResult = {
            errMsg: err ? 'Cancel progress listening is failed. Cause:' + err : 'Cancel progress listening is done.'
          }
          callback(res)
        })
      },
      onProgressUpdate: function (callback: DownloadTask.OnProgressUpdateCallback) {
        // console.warn('ddoowwnnllooaadd ON onProgressUpdate progress begin：' + downloadTask.on)
        downloadTask.on('progress', (receivedSize: number, totalSize: number) => {
          // console.warn('ddoowwnnllooaadd ON onProgressUpdate totalSize:' + totalSize + '，  receivedSize:' + receivedSize)
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
      },
      onHeadersReceived: function (_callback: DownloadTask.OnHeadersReceivedCallback): void {
        throw new Error('Function progress does not exist.')
      },
      offHeadersReceived: function (_callback: DownloadTask.OffHeadersReceivedCallback): void {
        throw new Error('Function progress does not exist.')
      }
    }

    console.warn('ddoowwnnllooaadd url: ' + options.url)

    const ohosParams: IDownloadConfigOHOS = {
      url
    }
    if (header) ohosParams.header = header
    if (filePath) ohosParams.filePath = filePath

    return request.download(ohosParams, (err: any, dataDownload:any) => {
      // console.warn('ddoowwnnllooaadd requestDownload TARO 2 download|||' + JSON.stringify(err) + '|||' + JSON.stringify(dataDownload))
      if (err) {
        callAsyncFail(reject, err, options)
      }
      downloadTask = dataDownload
      downloadTask.on('complete', (data) => {
        // console.warn('ddoowwnnllooaadd requestDownload TARO 3 complete' + '|||' + JSON.stringify(downloadTask))
        const res = {
          errMsg: 'ddoowwnnllooaadd Download task completed',
          data: data
        }
        callAsyncSuccess(resolve, res, options)
      })
      downloadTask.on('fail', (err) => {
        // console.warn('ddoowwnnllooaadd requestDownload TARO 4 fail |||' + JSON.stringify(errFail) + '|||' + JSON.stringify(downloadTask))
        const res = {
          errMsg: 'ddoowwnnllooaadd' + err
        }
        callAsyncSuccess(resolve, res, options)
      })
      resolve(DownloadTaskWX)
      return DownloadTaskWX
    })
  })
}

export {
  downloadFile
}
