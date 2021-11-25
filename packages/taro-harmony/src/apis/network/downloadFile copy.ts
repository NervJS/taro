// ✅ wx.downloadFile
// ✅ DownloadTask.abort
// ❌ DownloadTask.offHeadersReceived 此接口 ohos 不支持
// ✅ DownloadTask.offProgressUpdate
// ❌ DownloadTask.onHeadersReceived 此接口 ohos 不支持
// ✅ DownloadTask.onProgressUpdate

import { General } from '@tarojs/taro'
import { validateParams } from './validate'

const request = require('@ohos.request')

let downloadTask: General.IAnyObject = {}
const DownloadTaskWX: General.IAnyObject = {}

// ohos 不支持 wx 支持的 timeout
// wx 不支持 ohos 支持的 enableMetered，enableRoaming，description，networkType，title
// ohos 不支持 wx.downloadFile 参数中的 success 回调的参数

interface IDownloadConfigOHOS {
  url: string
  header?: General.IAnyObject
  filePath?: string
  enableMetered?: boolean // ohos参数
  enableRoaming?: boolean // ohos参数
  description?: string // ohos参数
  networkType?: number // ohos参数
  title?: string // ohos参数
}

interface IDownloadConfigWX extends IDownloadConfigOHOS {
  complete?: (res: any) => void
  fail?: (res: any) => void
  success?: (res: any) => void
  timeout?: number
}

// query 返回结果
// interface IDownloadTaskQueryOHOS {
//   downloadId: number
//   failedReason?: number
//   fileName: string
//   filePath: string
//   pausedReason?: number
//   status: number
//   targetURI: string
//   downloadTitle: string
//   downloadTotalBytes: number
//   description: string
//   downloadedBytes: number
// }

interface IWXDownloadSuccess {
  tempFilePath?: string
  fileParh?: string
  statusCode: number
  profile?: IWXDownloadSuccessProfile
}

interface IWXDownloadSuccessProfile {
  redirectStart?: number
  redirectEnd?: number
  fetchStart?: number
  domainLookupStart?: number
  domainLookupEnd?: number
  connectStart?: number
  connectEnd?: number
  SSLconnectionStart?: number
  SSLconnectionEnd?: number
  requestStart?: number
  requestEnd?: number
  rtt?: number
  estimate_nettype?: number
  httpRttEstimate?: number
  transportRttEstimate?: number
  downstreamThroughputKbpsEstimate?: number
  throughputKbps?: number
  peerIP?: string
  port?: number
  socketReused?: boolean
  sendBytesCount?: number
  receivedBytedCount?: number
  protocol?: string
}

function downloadFile (params: IDownloadConfigWX) {
  console.warn('ddoowwnnllooaadd url: ' + params.url)
  const requiredParamsValue: Array<any> = params.url === undefined ? [] : [params.url]
  const requiredParamsName: Array<string> = params.url === undefined ? [] : ['url']
  const requiredParamsType: Array<string> = params.url === undefined ? [] : ['string']
  const { res, isPassed } = validateParams('downloadFile', params, requiredParamsValue, requiredParamsType, requiredParamsName)
  if (!isPassed) {
    return Promise.reject(res)
  }

  const { url, header, filePath, success, fail, complete } = params

  const ohosParams: IDownloadConfigOHOS = {
    url
  }
  if (header) ohosParams.header = header
  if (filePath) ohosParams.filePath = filePath
  // console.warn('ddoowwnnllooaadd requestDownload TARO 1 ohosParams' + JSON.stringify(ohosParams))
  return request.download(ohosParams, (err: any, dataDownload:any) => {
    // console.warn('ddoowwnnllooaadd requestDownload TARO 2 download|||' + JSON.stringify(err) + '|||' + JSON.stringify(dataDownload))
    if (err) {
      fail && fail(err)
      complete && complete(err)
      throw new Error(err)
    }
    downloadTask = dataDownload
    // downloadTask.on('progress', (receivedSize, totalSize) => {
    //   if (receivedSize) {
    //     console.error('ddoowwnnllooaadd Progress listening is failed. Cause err:' + receivedSize + '。data:' + totalSize)
    //     // return
    //   }
    //   // console.warn('ddoowwnnllooaadd DownloadTask totalSize:' + totalSize + '  receivedSize:' + receivedSize + ', downloadTask：' + JSON.stringify(downloadTask))
    // })
    downloadTask.on('complete', () => {
      // console.warn('ddoowwnnllooaadd requestDownload TARO 3 complete' + '|||' + JSON.stringify(downloadTask))
      const wxdata: IWXDownloadSuccess = {
        // tempFilePath: dataDownload.filePath,
        // fileParh: dataDownload.filePath,
        statusCode: dataDownload.status
        // profile: {
        //   receivedBytedCount: dataDownload.downloadedBytes
        // }
      }
      success && success(wxdata)
      complete && complete(wxdata)
    })
    downloadTask.on('fail', (errFail) => {
      // console.warn('ddoowwnnllooaadd requestDownload TARO 4 fail |||' + JSON.stringify(errFail) + '|||' + JSON.stringify(downloadTask))
      if (errFail) {
        fail && fail(errFail)
        complete && complete(errFail)
        throw new Error(errFail)
      }
    })
    return DownloadTaskWX
  })
}

DownloadTaskWX.abort = function abort () {
  // console.warn('ddoowwnnllooaadd abort begin：' + downloadTask.remove)
  downloadTask.remove((err: any, data: any) => {
    if (err) {
      console.error('Failed to remove the download task. Cause:' + err + '|||' + JSON.stringify(downloadTask))
      return
    }
    console.warn('Download task removed.' + data + '|||' + JSON.stringify(downloadTask))
  })
}

interface IProgressUpdateParams {
  progress: number
  totalBytesSent: number
  totalBytesExpectedToSend: number
}
DownloadTaskWX.onProgressUpdate = function onProgressUpdate (callback: (params: IProgressUpdateParams) => void) {
  // console.warn('ddoowwnnllooaadd ON onProgressUpdate progress begin：' + downloadTask.on)
  downloadTask.on('progress', (receivedSize: number, totalSize: number) => {
    // console.warn('ddoowwnnllooaadd ON onProgressUpdate totalSize:' + totalSize + '，  receivedSize:' + receivedSize)
    const totalBytesSent: number = receivedSize * 1024
    const totalBytesExpectedToSend: number = totalSize * 1024
    // TODO: 应该保留几位小数？
    const progress: number = +(receivedSize / totalSize).toFixed(6)
    const progressParams: IProgressUpdateParams = {
      totalBytesSent,
      totalBytesExpectedToSend,
      progress
    }
    callback(progressParams)
  })
}

DownloadTaskWX.offProgressUpdate = function offProgressUpdate (callback: any) {
  // console.warn('ddoowwnnllooaadd OFF offProgressUpdate progress begin：' + downloadTask.on)
  downloadTask.off('progress', (receivedSize: number, totalSize: number) => {
    // console.warn('ddoowwnnllooaadd OFF offProgressUpdate totalSize:' + totalSize + '，  receivedSize:' + receivedSize)
    const totalBytesSent: number = receivedSize * 1024
    const totalBytesExpectedToSend: number = totalSize * 1024
    // TODO: 应该保留几位小数？
    const progress: number = +(receivedSize / totalSize).toFixed(6)
    const progressParams: IProgressUpdateParams = {
      totalBytesSent,
      totalBytesExpectedToSend,
      progress
    }
    callback(progressParams)
  })
}

export {
  downloadFile
}
