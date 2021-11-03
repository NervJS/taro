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
}

interface IDownloadConfig extends IDownloadConfigOHOS {
  complete?: (res: any) => void
  fail?: (res: any) => void
  success?: (res: any) => void
  timeout?: number
}

interface IDownloadTaskQuery {
  downloadId: number
  failedReason?: number
  fileName: string
  filePath: string
  pausedReason?: number
  status: number
  targetURI: string
  downloadTitle: string
  downloadTotalBytes: number
  description: string
  downloadedBytes: number
}

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

function downloadFile (params: IDownloadConfig) {
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

  request.download('ohosParams', (err: any, data:any) => {
    if (err) {
      fail && fail(err)
      complete && complete(err)
      throw new Error(err)
    }
    downloadTask = data
    downloadTask.on('complete', () => {
      downloadTask.query((errQuery: any, data: IDownloadTaskQuery) => {
        if (errQuery) {
          fail && fail(errQuery)
          complete && complete(errQuery)
          throw new Error(errQuery)
        }
        const wxdata: IWXDownloadSuccess = {
          tempFilePath: data.filePath,
          fileParh: data.filePath,
          statusCode: data.status,
          profile: {
            receivedBytedCount: data.downloadedBytes
          }
        }
        success && success(wxdata)
      })
    })
    complete && complete(downloadTask)
  })
}

DownloadTaskWX.abort = function abort () {
  downloadTask.remove((err: any, data: any) => {
    if (err) {
      console.error('Failed to remove the download task. Cause:' + err)
      return
    }
    console.warn('Download task removed.' + data)
  })
}

interface IProgressUpdateParams {
  progress: number
  totalBytesSent: number
  totalBytesExpectedToSend: number
}
DownloadTaskWX.onProgressUpdate = function onProgressUpdate (callback: (params: IProgressUpdateParams) => void) {
  downloadTask.on('progress', (receivedSize: number, totalSize: number) => {
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
  downloadTask.off('progress', (uploadSize: number, totalSize: number) => {
    const totalBytesSent: number = uploadSize * 1024
    const totalBytesExpectedToSend: number = totalSize * 1024
    // TODO: 应该保留几位小数？
    const progress: number = +(uploadSize / totalSize).toFixed(6)
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
