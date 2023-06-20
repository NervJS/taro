// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-request-0000001123753962#section455311474372
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html
// ✅ wx.downloadFile (BETA)7+,因为使用了 query 和 on('complete')
// ✅ DownloadTask.abort
// ✅ DownloadTask.offProgressUpdate
// ✅ DownloadTask.onProgressUpdate
// ❌ DownloadTask.onHeadersReceived 此接口 ohos 不支持
// ❌ DownloadTask.offHeadersReceived 此接口 ohos 不支持

import Taro, { DownloadTask } from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

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

    const ohosParams: IDownloadConfigOHOS = {
      url
    }
    if (header) ohosParams.header = header
    if (filePath) ohosParams.filePath = filePath

    request.download(ohosParams).then((dataDownload:any) => {
      downloadTask = dataDownload

      // TODO: 建议鸿蒙优化 complete 回调接口。
      // ohos 的 complete 回调不返回任何下载信息，需要调用 query 查询后，在 complete 和 fail 中调用回调返回
      downloadTask.query().then(dataQuery => {
        downloadTask.on('complete', () => {
          dataQuery.status = dataQuery.statusCode
          callAsyncSuccess(resolve, dataQuery, options)
        })
        downloadTask.on('fail', (err) => {
          const res = {
            errMsg: err
          }
          callAsyncFail(reject, res, options)
        })
      }).catch((err) => {
        callAsyncFail(reject, err, options)
      })
    }).catch((err) => {
      callAsyncFail(reject, err, options)
    })
  })
  downloadTaskWX.abort = function () {
    downloadTask.remove((err: any, data: any) => {
      if (err) {
        return err
      }
      return data
    })
  }
  downloadTaskWX.offProgressUpdate = function offProgressUpdate (callback: DownloadTask.OffProgressUpdateCallback) {
    validateParams('offProgressUpdate', [callback], ['Function'])
    downloadTask.off('progress', (receivedSize: number, totalSize: number) => {
      const totalBytesWritten: number = receivedSize * 1024
      const totalBytesExpectedToWrite: number = totalSize * 1024
      // TODO: 进度应该保留几位小数？暂时保留6位
      const progress: number = +(receivedSize / totalSize).toFixed(6)
      const progressParams = {
        totalBytesWritten,
        totalBytesExpectedToWrite,
        progress,
        errMsg: 'Cancel progress listening is done.'
      }
      callback(progressParams)
    })
  }
  // wx 单位是 Bytes，ohos 单位是 KBytes
  downloadTaskWX.onProgressUpdate = function (callback: DownloadTask.OnProgressUpdateCallback) {
    validateParams('onProgressUpdate', [callback], ['Function'])
    downloadTask.on('progress', (receivedSize: number, totalSize: number) => {
      const totalBytesWritten: number = receivedSize * 1024
      const totalBytesExpectedToWrite: number = totalSize * 1024
      // TODO: 进度应该保留几位小数？暂时保留6位
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
