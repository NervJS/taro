import { General } from '@tarojs/taro'
import { validateParams } from './validate'

const request = require('@ohos.request')
let uploadTask: General.IAnyObject = {}

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

// wx 只支持 HTTP POST 请求，OHOS 支持 POST 和 PUT 请求
// OHOS 不支持 wx 的 timeout，但是支持 file 文件列表上传，wx 是单文件上传
function uploadFile (params: IUploadFileParamsWX) {
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

  const { url, filePath, name, header, formData, success, fail, complete } = params

  const file: IOHOSFileType = {
    url: filePath,
    name
  }
  const files: Array<IOHOSFileType> = [file]
  const ohosParams: IUploadFileParamsOHOS = {
    url: url,
    files,
    method: 'POST'
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
  if (header) ohosParams.header = header

  if (success && fail && complete) {
    request.upload(ohosParams, (err: any, res: any) => {
      if (err) {
        fail && fail(err)
        complete && complete(err)
        return
      }

      uploadTask = res
      success && success(res)
      complete && complete(res)
    })
  } else {
    request.upload(ohosParams).then((res: any) => {
      uploadTask = res
    })
    return Promise.resolve(uploadTask)
  }
}

function abort () {
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

function onHeadersReceived (callback: (params: General.IAnyObject) => void) {
  uploadTask.on('headerReceive', (headers: General.IAnyObject) => {
    callback(headers)
  })
}

function offHeadersReceived (callback: (params: any) => void) {
  uploadTask.off('headerReceive', (headers: General.IAnyObject) => {
    callback(headers)
  })
}

interface IProgressUpdateParams {
  progress: number
  totalBytesSent: number
  totalBytesExpectedToSend: number
}
function onProgressUpdate (callback: (params: IProgressUpdateParams) => void) {
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

function offProgressUpdate (callback: any) {
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

export {
  uploadFile,
  abort,
  onHeadersReceived,
  offHeadersReceived,
  onProgressUpdate,
  offProgressUpdate
}
