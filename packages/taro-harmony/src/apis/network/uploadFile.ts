// ✅ wx.uploadFile
// ✅ UploadTask.abort
// ✅ UploadTask.offHeadersReceived
// ✅ UploadTask.offProgressUpdate
// ✅ UploadTask.onHeadersReceived
// ✅ UploadTask.onProgressUpdate

import { General } from '@tarojs/taro'
import { validateParams } from './validate'

const request = require('@ohos.request')

interface ISuccessParams {
  data: string
  statusCode: number
}

interface IUploadFileParamsWX {
  url: string
  filePath: string
  name: string
  header?: General.IAnyObject
  formData?: General.IAnyObject
  timeout?: number
  complete?: (res: General.CallbackResult) => void
  fail?: (res: General.CallbackResult) => void
  success?: (res: ISuccessParams) => void
}

interface IOHOSFileType {
  filename?: string
  name?: string
  url: string // 支持“dataability”和“internal”两种协议类型，但“internal”仅支持临时目录。详见官方文档
  type?: string
}

interface IRequestDataOHOS {
  name?: string
  value?: string
}

interface IUploadFileParamsOHOS {
  url: string // 资源地址
  header?: General.IAnyObject
  method?: string // POST、PUT。缺省为POST
  files?: Array<IOHOSFileType> // 请使用 multipart/form-data提交。官方文档提供的demo未传此参数，应该是文档错了。
  data?: Array<IRequestDataOHOS>
}

interface IProgressUpdateParams {
  progress: number
  totalBytesSent: number
  totalBytesExpectedToSend: number
}

// wx 只支持 HTTP POST 请求，OHOS 支持 POST 和 PUT 请求
// OHOS 不支持 wx 的 timeout，但是支持 file 文件列表上传，wx 是单文件上传
function uploadFile (params: IUploadFileParamsWX) {
  let uploadTask: General.IAnyObject = {}
  const UploadTaskWX: General.IAnyObject = {}

  UploadTaskWX.abort = function abort () {
    uploadTask.remove((err: any, result: any) => {
      if (err) {
        console.error('Failed to remove the upload task. Cause: ' + JSON.stringify(err))
        return
      }
      if (result) {
        console.error('Upload task removed successfully.')
      } else {
        console.error('Failed to remove the upload task.')
      }
    })
  }

  UploadTaskWX.onHeadersReceived = function onHeadersReceived (callback: (params: General.IAnyObject) => void) {
    uploadTask.on('headerReceive', (headers: General.IAnyObject) => {
      callback(headers)
    })
  }

  UploadTaskWX.offHeadersReceived = function offHeadersReceived (callback: (params: any) => void) {
    uploadTask.off('headerReceive', (headers: General.IAnyObject) => {
      callback(headers)
    })
  }

  UploadTaskWX.onProgressUpdate = function onProgressUpdate (callback: (params: IProgressUpdateParams) => void) {
    uploadTask.on('progress', (uploadSize: number, totalSize: number) => {
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

  UploadTaskWX.offProgressUpdate = function offProgressUpdate (callback: any) {
    uploadTask.off('progress', (uploadSize: number, totalSize: number) => {
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

  const requiredParamsValue: Array<any> = params.url === undefined ? [] : [params.url]
  const requiredParamsName: Array<string> = params.url === undefined ? [] : ['url']
  const requiredParamsType: Array<string> = params.url === undefined ? [] : ['string']
  if (params.filePath !== undefined) {
    requiredParamsValue.push(params.filePath)
    requiredParamsName.push('filePath')
    requiredParamsType.push('string')
  }
  if (params.name !== undefined) {
    requiredParamsValue.push(params.name)
    requiredParamsName.push('name')
    requiredParamsType.push('string')
  }
  const { res, isPassed } = validateParams('connectSockets', params, requiredParamsValue, requiredParamsType, requiredParamsName)
  if (!isPassed) {
    return Promise.reject(res)
  }
  console.warn('uuppllooaadd requestUpload Taro -1:' + JSON.stringify(params) + '。')

  const { url, filePath, name, header, formData, timeout, success, fail, complete } = params

  const file: IOHOSFileType = {
    url: filePath,
    name
  }
  const files: Array<IOHOSFileType> = [file]
  const ohosParams: IUploadFileParamsOHOS = {
    url,
    files,
    method: 'POST'
  }
  console.warn('uuppllooaadd requestUpload Taro -2:' + JSON.stringify(ohosParams) + '。')

  if (formData) {
    const rData: Array<IRequestDataOHOS> = []
    Object.keys(formData).forEach((key: string) => {
      const rDataEle: IRequestDataOHOS = {
        name: key,
        value: formData[key]
      }
      rData.push(rDataEle)
    })
    ohosParams.data = rData
  }
  if (header) ohosParams.header = header
  console.warn('uuppllooaadd requestUpload Taro -3:' + JSON.stringify(ohosParams) + '。')

  let timer
  console.warn('uuppllooaadd requestUpload Taro 0:' + timeout + '。')
  if (timeout !== undefined) {
    timer = setTimeout(() => {
      const err: {errMsg: string} = {
        errMsg: 'uploadFile request timeout, please try again later.'
      }
      console.warn('uuppllooaadd requestUpload Taro 1:' + timeout + '。')
      if (success || fail || complete) {
        fail && fail(err)
        complete && complete(err)
        return err
      } else {
        return Promise.reject(err)
      }
    }, timeout)
  }
  console.warn('uuppllooaadd requestUpload Taro 2:' + fail + '。')
  // if (success || fail || complete) {
  console.warn('uuppllooaadd requestUpload Taro 3。')
  request.upload(ohosParams, (err: any, res: any) => {
    console.warn('uuppllooaadd requestUpload Taro 4' + timer + '。', err)
    if (timer) {
      clearTimeout(timer)
    }
    console.warn('uuppllooaadd requestUpload Taro 5' + err + '。', res)
    if (err) {
      fail && fail(err)
      complete && complete(err)
      return
    }
    uploadTask = res
    success && success(res)
    complete && complete(res)
    UploadTaskWX
    return UploadTaskWX
  })
  console.warn('uuppllooaadd requestUpload Taro 6' + JSON.stringify(UploadTaskWX) + '。')
  return UploadTaskWX
  // } else {
  //   request.upload(ohosParams).then((res: any) => {
  //     clearTimeout(timer)
  //     uploadTask = res
  //   })
  //   return Promise.resolve(UploadTaskWX)
  // }
}

export {
  uploadFile
}
