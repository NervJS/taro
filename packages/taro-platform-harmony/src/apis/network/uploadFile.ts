// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-request-0000001123753962#section455311474372
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
// ✅ wx.uploadFile
// ✅ UploadTask.abort
// ✅ UploadTask.offHeadersReceived (BETA)7+
// ✅ UploadTask.offProgressUpdate
// ✅ UploadTask.onHeadersReceived(BETA)7+
// ✅ UploadTask.onProgressUpdate

import { isUndefined } from '@tarojs/shared'
import Taro, { UploadTask } from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

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

const uploadSchema = {
  url: 'String'
  // filePath: 'String',
  // name: 'String'
}

// wx 只支持 HTTP POST 请求，OHOS 支持 POST 和 PUT 请求
// OHOS 不支持 wx 的 timeout，但是支持 file 文件列表上传，wx 是单文件上传
const uploadFile: UploadFile = function (options) {
  let uploadTask: TaroGeneral.IAnyObject = {}

  const UploadTaskWX: any = new Promise((resolve, reject) => {
    let timer
    const { url, filePath, name, header, formData, timeout } = options

    try {
      validateParams('uploadFile', options, uploadSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

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
    if (!isUndefined(timeout)) {
      timer = setTimeout(() => {
        const err: {errMsg: string} = {
          errMsg: 'uploadFile request timeout, please try again later.'
        }
        callAsyncFail(reject, err, options)
      }, timeout)
    }

    request.upload(ohosParams).then((dataUpload) => {
      if (timer) {
        clearTimeout(timer)
      }
      uploadTask = dataUpload
      callAsyncSuccess(resolve, UploadTaskWX, options)
    }).catch((err) => {
      if (timer) {
        clearTimeout(timer)
      }
      callAsyncFail(reject, err, options)
    })
  })

  UploadTaskWX.abort = function () {
    uploadTask.remove((err: any, result: any) => {
      if (err || result) {
        return err || result
      }
      return result
    })
  }
  UploadTaskWX.onHeadersReceived = function (callback: (params) => void) {
    validateParams('onHeadersReceived', [callback], ['Function'])
    uploadTask.on('headerReceive', (headers: TaroGeneral.IAnyObject) => {
      callback(headers)
    })
  }
  UploadTaskWX.offHeadersReceived = function (callback: (params) => void) {
    validateParams('offHeadersReceived', [callback], ['Function'])
    uploadTask.off('headerReceive', (headers: TaroGeneral.IAnyObject) => {
      callback(headers)
    })
  }
  // wx 单位是 Bytes，ohos 单位是 KBytes
  UploadTaskWX.onProgressUpdate = function (callback: UploadTask.OnProgressUpdateCallback) {
    validateParams('onProgressUpdate', [callback], ['Function'])
    uploadTask.on('progress', (uploadSize: number, totalSize: number) => {
      const totalBytesSent: number = uploadSize * 1024
      const totalBytesExpectedToSend: number = totalSize * 1024
      // TODO: 进度应该保留几位小数？暂时保留6位
      const progress: number = +(uploadSize / totalSize).toFixed(6)
      const progressParams: UploadTask.OnProgressUpdateCallbackResult = {
        totalBytesSent,
        totalBytesExpectedToSend,
        progress
      }
      callback(progressParams)
    })
  }
  UploadTaskWX.offProgressUpdate = function (callback: UploadTask.OffProgressUpdateCallback) {
    validateParams('offProgressUpdate', [callback], ['Function'])
    uploadTask.off('progress', (uploadSize: number, totalSize: number) => {
      const totalBytesSent: number = uploadSize * 1024
      const totalBytesExpectedToSend: number = totalSize * 1024
      // TODO: 进度应该保留几位小数？暂时保留6位
      const progress: number = +(uploadSize / totalSize).toFixed(6)
      const progressParams = {
        totalBytesSent,
        totalBytesExpectedToSend,
        progress,
        errMsg: 'Cancel progress listening is done.'
      }
      callback(progressParams)
    })
  }

  return UploadTaskWX
}

export {
  uploadFile
}
