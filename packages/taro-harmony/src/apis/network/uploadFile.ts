// ✅ wx.uploadFile
// ✅ UploadTask.abort
// ✅ UploadTask.offHeadersReceived
// ✅ UploadTask.offProgressUpdate
// ✅ UploadTask.onHeadersReceived
// ✅ UploadTask.onProgressUpdate

import Taro from '@tarojs/taro'
import { isUndefined } from '@tarojs/shared'
import { validateOptions, callAsyncSuccess, callAsyncFail, callbackInPromise } from '../utils'
const request = require('@ohos.request')

type UploadFile = typeof Taro.uploadFile

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
  header?: TaroGeneral.IAnyObject
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
// TODO: 增加函数类型
const uploadFile: UploadFile = function (options) {
  let uploadTask: TaroGeneral.IAnyObject = {}

  const UploadTaskWX: any = new Promise((resolve, reject) => {
    let timer
    const { url, filePath, name, header, formData, timeout } = options
    const voOtions = {
      funcName: 'uploadFile',
      options,
      rParamNames: ['url', 'filePath', 'name'],
      rTypes: ['string', 'string', 'string']
    }
    const { res, isPassed } = validateOptions(voOtions)
    if (!isPassed) {
      callAsyncFail(reject, res, options)
      return
    }

    // console.warn('uuppllooaadd requestUpload Taro 1:' + JSON.stringify(options))

    const file: IOHOSFileType = {
      url: filePath,
      name
    }
    const files: Array<IOHOSFileType> = [file]
    const ohosParams: IUploadFileParamsOHOS = {
      url,
      files,
      method: 'POST',
      header
    }

    // console.warn('uuppllooaadd requestUpload Taro 2:' + JSON.stringify(ohosParams))

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
    console.warn('uuppllooaadd requestUpload Taro 3:' + JSON.stringify(ohosParams))
    console.warn('uuppllooaadd requestUpload Taro 4:' + timeout)
    if (!isUndefined(timeout)) {
      timer = setTimeout(() => {
        const err: {errMsg: string} = {
          errMsg: 'uploadFile request timeout, please try again later.'
        }
        console.warn('uuppllooaadd requestUpload Taro setTimeout err.')
        callAsyncFail(reject, err, options)
      }, timeout)
    }

    console.warn('uuppllooaadd requestUpload Taro 5')
    request.upload(ohosParams).then((dataUpload) => {
      console.warn('uuppllooaadd requestUpload Taro 6' + timer)
      if (timer) {
        clearTimeout(timer)
      }
      uploadTask = dataUpload
      callAsyncSuccess(resolve, UploadTaskWX, options)
    }).catch((err) => {
      if (timer) {
        clearTimeout(timer)
      }
      console.error('uuppllooaadd Failed to request the upload. Cause: ' + JSON.stringify(err))
      callAsyncFail(reject, err, options)
    })
  })

  UploadTaskWX.abort = function () {
    callbackInPromise((resolve, reject) => {
      uploadTask.remove((err: any, result: any) => {
        if (err) {
          console.error('Failed to remove the upload task. Cause: ' + JSON.stringify(err))
          reject(err)
          return
        }
        if (result) {
          console.error('Upload task removed successfully.')
          resolve(result)
        } else {
          reject(result)
          console.error('Failed to remove the upload task.')
        }
      })
    })
  }
  UploadTaskWX.onHeadersReceived = function (callback: (params) => void) {
    callbackInPromise((resolve, _reject) => {
      uploadTask.on('headerReceive', (headers: TaroGeneral.IAnyObject) => {
        resolve(resolve)
        callback(headers)
      })
    })
  }
  UploadTaskWX.offHeadersReceived = function (callback: (params) => void) {
    callbackInPromise((resolve, _reject) => {
      uploadTask.off('headerReceive', (headers: TaroGeneral.IAnyObject) => {
        callback(headers)
        resolve(headers)
      })
    })
  }
  UploadTaskWX.onProgressUpdate = function (callback: (params) => void) {
    callbackInPromise((resolve, _reject) => {
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
        resolve(progressParams)
      })
    })
  }
  UploadTaskWX.offProgressUpdate = function (callback) {
    return callbackInPromise((resolve, _reject) => {
      uploadTask.off('progress', (uploadSize: number, totalSize: number) => {
        const totalBytesSent: number = uploadSize * 1024
        const totalBytesExpectedToSend: number = totalSize * 1024
        // TODO: 应该保留几位小数？
        const progress: number = +(uploadSize / totalSize).toFixed(6)
        const progressParams = {
          totalBytesSent,
          totalBytesExpectedToSend,
          progress,
          errMsg: '0'
        }
        callback(progressParams)
        resolve(progressParams)
      })
    })
  }

  return UploadTaskWX
}

export {
  uploadFile
}
