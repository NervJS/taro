// ✅ wx.uploadFile
// ✅ UploadTask.abort
// ✅ UploadTask.offHeadersReceived
// ✅ UploadTask.offProgressUpdate
// ✅ UploadTask.onHeadersReceived
// ✅ UploadTask.onProgressUpdate

import Taro from '@tarojs/taro'
import { isUndefined } from '@tarojs/shared'
import { callAsyncSuccess, callAsyncFail } from '../utils'
import { validateOptions } from './validate'
const request = require('@ohos.request')

// type UploadFile = typeof Taro.uploadFile

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
const uploadFile = function (options) {
  return new Promise((resolve, reject) => {
    let timer
    const { url, filePath, name, header, formData, timeout } = options
    const requiredParamsValue: Array<any> = [url, filePath, name]
    const requiredParamsName: Array<string> = ['url', 'filePath', 'name']
    const requiredParamsType: Array<string> = ['string', 'string', 'string']
    // TODO: validateOptions扩展后，可以和utils中的合并，但需要改造已经使用了validateOptions的代码
    const { res, isPassed } = validateOptions('uploadFile', options, requiredParamsValue, requiredParamsType, requiredParamsName)
    if (!isPassed) {
      callAsyncFail(reject, res, options)
      return
    }

    let uploadTask: TaroGeneral.IAnyObject = {}
    const UploadTaskWX: Taro.uploadFile.SuccessCallbackResult & Taro.UploadTask = {
      data: '',
      statusCode: 0,
      errMsg: '',
      abort: function abort () {
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
      },
      onHeadersReceived: function onHeadersReceived (callback: (params) => void) {
        uploadTask.on('headerReceive', (headers: TaroGeneral.IAnyObject) => {
          callback(headers)
        })
      },
      offHeadersReceived: function offHeadersReceived (callback: (params) => void) {
        uploadTask.off('headerReceive', (headers: TaroGeneral.IAnyObject) => {
          callback(headers)
        })
      },
      onProgressUpdate: function onProgressUpdate (callback: (params) => void) {
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
      },
      offProgressUpdate: function offProgressUpdate (callback) {
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
        })
      },
      headersReceived: function (_callback): void {
        throw new Error('nction headersReceived does not exist.')
      },
      progress: function (_callback): void {
        throw new Error('Function progress does not exist.')
      }
    }

    console.warn('uuppllooaadd requestUpload Taro -1:' + JSON.stringify(options) + '。')

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

    console.warn('uuppllooaadd requestUpload Taro 0:' + timeout + '。')
    if (!isUndefined(timeout)) {
      timer = setTimeout(() => {
        const err: {errMsg: string} = {
          errMsg: 'uploadFile request timeout, please try again later.'
        }
        console.warn('uuppllooaadd requestUpload Taro 1:' + timeout + '。')
        callAsyncFail(reject, err, options)
      }, timeout)
    }

    console.warn('uuppllooaadd requestUpload Taro 3。')
    request.upload(ohosParams, (err: any, res: any) => {
      console.warn('uuppllooaadd requestUpload Taro 4' + timer + '。', err)
      if (timer) {
        clearTimeout(timer)
      }
      console.warn('uuppllooaadd requestUpload Taro 5' + err + '。', res)
      if (err) {
        callAsyncFail(reject, err, options)
      } else {
        uploadTask = res
        callAsyncSuccess(resolve, UploadTaskWX, options)
      }
    })
  })
}

export {
  uploadFile
}
