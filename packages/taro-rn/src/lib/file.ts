import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'
import { shouldBeObject, successHandler, errorHandler } from '../utils'

interface Func{
  (arg: any): void
}

interface ExtPromise<T> extends Promise<T> {
  onProgressUpdateCb?: Func,
  onProgressUpdate?: Func,
  abort?: Func
}

let timer: any

const _fetch = (requestPromise, timeout) => {
  let timeoutAction
  const timerPromise = new Promise((_resolve, reject) => {
    timeoutAction = () => {
      reject(new Error('网络请求超时'))
    }
  })
  timer = setTimeout(() => {
    timeoutAction()
    !!timer && clearTimeout(timer)
  }, timeout)

  return Promise.race([requestPromise, timerPromise])
}

const isAndroid = Platform.OS === 'android'

const createFormData = (filePath, body, name) => {
  const data = new FormData()
  const uri = isAndroid ? filePath : filePath.replace('file://', '')
  const fileObj = { uri: uri, type: 'application/octet-stream', name: 'file' }

  Object.keys(body).forEach(key => {
    data.append(key, body[key])
  })

  // @ts-ignore
  data.append(name, fileObj)

  return data
}

/**
 * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。
 * @param {object} opts
 * @param {string} opts.url - 开发者服务器地址
 * @param {number} opts.timeout - 超时时间，单位为毫秒
 * @param {string} opts.filePath - 要上传文件资源的路径
 * @param {string} opts.name - 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {object} [opts.header] - HTTP 请求 Header，Header 中不能设置 Referer
 * @param {object} [opts.formData] - HTTP 请求中其他额外的 form data
 * @return UploadTask - 一个可以监听上传进度进度变化的事件和取消上传的对象
 */
function uploadFile (opts: Taro.uploadFile.Option): Promise<Taro.uploadFile.SuccessCallbackResult & Taro.UploadTask> {
  const { url, timeout = 2000, filePath, name, header, formData = {}, success, fail, complete } = opts

  const execFetch = fetch(url, {
    method: 'POST',
    body: createFormData(filePath, formData, name),
    headers: header
  })

  return _fetch(execFetch, timeout).then((res: any) => {
    return successHandler(success, complete)(res)
  }).catch(e => {
    const errMsg = `uploadFile fail: ${e}`
    return errorHandler(fail, complete)({ errMsg })
  })
}

/**
 * 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径，单次下载允许的最大文件为 50MB。
 * @param opts
 * @param {string} opts.url - 下载资源的 url
 * @param {Object} [opts.header] - HTTP 请求的 Header，Header 中不能设置 Referer
 * @param {string} [opts.filePath] - 指定文件下载后存储的路径
 * @returns {*}
 */
function downloadFile (opts: Taro.downloadFile.Option): Promise<Taro.DownloadTask> {
  const { url, header, filePath, success, fail, complete }: any = opts
  let downloadResumable
  const p: ExtPromise<any> = new Promise((resolve, reject) => {
    let fileName = url.split('/')
    fileName = fileName[fileName.length - 1]
    const downloadFileCallback = (res) => {
      const { totalBytesWritten, totalBytesExpectedToWrite } = res
      let progress = totalBytesWritten / totalBytesExpectedToWrite * 100
      progress = Number(progress.toFixed(2))
      p.onProgressUpdateCb && p.onProgressUpdateCb({
        progress,
        totalBytesWritten,
        totalBytesExpectedToWrite
      })
    }
    downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath || `${FileSystem.documentDirectory}${fileName}`,
      {
        headers: header
      },
      downloadFileCallback
    )

    downloadResumable.downloadAsync().then((resp) => {
      const { uri, status } = resp
      const res: any = {
        tempFilePath: uri,
        statusCode: status
      }
      filePath && (res.filePath = filePath)
      success?.(res)
      complete?.(res)
      resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: 'download file fail',
        err
      }
      fail?.(res)
      complete?.(res)
      reject(res)
    })
  })

  p.onProgressUpdate = (cb) => {
    if (cb) {
      p.onProgressUpdateCb = cb
    }
  }

  p.abort = (cb) => {
    downloadResumable.pauseAsync()
    cb && cb()
  }

  return p
}

/**
 * 保存文件到本地。注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用
 * @param opts
 * @param {string} opts.tempFilePath 需要保存的文件的临时路径
 */
async function saveFile (opts: Taro.saveFile.Option): Promise<Taro.saveFile.SuccessCallbackResult | Taro.saveFile.FailCallbackResult> {
  const res = <any>{ errMsg: 'saveFile:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `saveFile${isObject.msg}`
    return Promise.reject(res)
  }

  const { tempFilePath, filePath, success, fail, complete }: any = opts || {}
  const fileName = tempFilePath.substring(tempFilePath.lastIndexOf('/') + 1)
  const destPath = filePath || FileSystem.documentDirectory
  const savedFilePath = destPath + fileName

  try {
    const props = await FileSystem.getInfoAsync(destPath)
    if (!props.exists) {
      await FileSystem.makeDirectoryAsync(destPath, { intermediates: true })
    }
    if (filePath) {
      // const toPath = !isAndroid ? destPath : savedFilePath
      await FileSystem.moveAsync({ from: tempFilePath, to: savedFilePath })
    }
    res.savedFilePath = savedFilePath
    success?.(res)
    complete?.(res)
    return res
  } catch (e) {
    res.errMsg = `saveFile:fail. ${e.message}`
    fail?.(res)
    complete?.(res)
    throw res
  }
}

/**
 * 删除本地缓存文件
 * @param opts
 * @param {string} opts.filePath 需要删除的文件路径
 */
async function removeSavedFile (opts: Taro.removeSavedFile.Option): Promise<TaroGeneral.CallbackResult> {
  let res = <any>{ errMsg: 'removeSavedFile:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `removeSavedFile${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { filePath, success, fail, complete }: any = opts || {}

  try {
    const obj: any = await FileSystem.deleteAsync(filePath)
    res = {
      ...res,
      ...obj
    }
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `removeSavedFile:fail. ${e.message}`
    return errorHandler(fail, complete)(res)
  }
}

/**
 * 获取该小程序下已保存的本地缓存文件列表
 * @param opts
 * @param {string} opts.filePath 文件路径
 */
async function getSavedFileList (opts: Taro.getSavedFileList.Option = {}): Promise<Taro.getSavedFileList.SuccessCallbackResult> {
  const res = <any>{ errMsg: 'getSavedFileList:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getSavedFileList${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { success, fail, complete }: any = opts
  const fileList = <any>[]
  try {
    const fileNameList = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string)
    fileNameList.forEach(async (fileName) => {
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + fileName)
      if (fileInfo.isDirectory) {
        fileList.push({
          filePath: fileInfo.uri,
          size: fileInfo.size,
          createTime: fileInfo.modificationTime
        })
      }
    })
    res.fileList = fileList
    success?.(res)
    complete?.(res)
    return res
  } catch (e) {
    res.errMsg = `getSavedFileList:fail. ${e.message}`
    fail?.(res)
    complete?.(res)
    throw res
  }
}

/**
 * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo() 接口。
 * @param opts
 */
async function getSavedFileInfo (opts: Taro.getSavedFileInfo.Option): Promise<Taro.getSavedFileInfo.SuccessCallbackResult> {
  const res = <any>{ errMsg: 'getSavedFileInfo:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getSavedFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { filePath, success, fail, complete }: any = opts || {}

  try {
    const obj = await FileSystem.getInfoAsync(filePath, { md5: true })
    if (!obj.exists) {
      throw new Error('filePath not exists')
    }
    res.size = obj.size
    res.createTime = obj.modificationTime
    success?.(res)
    complete?.(res)
    return res
  } catch (e) {
    res.errMsg = `getSavedFileInfo:fail. ${e.message}`
    fail?.(res)
    complete?.(res)
    throw res
  }
}

/**
 * 获取文件信息
 * @param opts
 * @param {string} opts.filePath -  本地文件路径
 * @param {string} [opts.digestAlgorithm] - 计算文件摘要的算法
 */
async function getFileInfo (opts: Taro.getFileInfo.Option): Promise<Taro.getFileInfo.SuccessCallbackResult | Taro.getFileInfo.FailCallbackResult> {
  const res = <any>{ errMsg: 'getFileInfo:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { filePath, success, fail, complete }: any = opts || {}

  try {
    const obj = await FileSystem.getInfoAsync(filePath, { md5: true })
    if (!obj.exists) {
      throw new Error('filePath not exists')
    }
    res.size = obj.size
    res.md5 = obj.md5
    success?.(res)
    complete?.(res)
    return res
  } catch (e) {
    res.errMsg = `getFileInfo:fail. ${e.message}`
    fail?.(res)
    complete?.(res)
    throw res
  }
}

/**
 * @todo
 * 获取全局唯一的文件管理器
 */
// function getFileSystemManager () {
//   console.log('not finished')
// }

/**
 * @todo
 * 新开页面打开文档
 * @param opts
 * @param opts.filePath 文件路径，可通过 downloadFile 获得
 * @param opts.fileType 文件类型，指定文件类型打开文件
 */
// function openDocument (opts = {}) {
//   console.log('not finished')
// }

export {
  downloadFile,
  uploadFile,
  saveFile,
  removeSavedFile,
  getSavedFileList,
  getSavedFileInfo,
  getFileInfo
}
