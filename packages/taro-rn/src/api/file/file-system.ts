import * as FileSystem from 'expo-file-system'
import { shouleBeObject } from '../utils'
import { string } from 'prop-types'

console.log(FileSystem.cacheDirectory, FileSystem.documentDirectory)

/**
 * 保存文件到本地。注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用
 * @param opts
 * @param {string} opts.tempFilePath 需要保存的文件的临时路径
 */
export async function saveFile (opts = {}) {
  const res = <any>{errMsg: 'removeSavedFile:ok'}
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `removeSavedFile${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  let {tempFilePath, success, fail, complete}: any = opts

  let fileName = tempFilePath.substring(tempFilePath.lastIndexOf('/') + 1)
  let destPath = FileSystem.documentDirectory + fileName
  try {
    await FileSystem.moveAsync({from: tempFilePath, to: destPath})
    res.savedFilePath = destPath
    success && success(res)
    complete && complete(res)
    return res
  } catch (e) {
    res.errMsg = `removeSavedFile:fail. ${e.message}`
    fail && fail(res)
    complete && complete(res)
    throw res
  }
}

/**
 * 删除本地缓存文件
 * @param opts
 * @param {string} opts.filePath 需要删除的文件路径
 */
export function removeSavedFile (opts = {}) {
  const res = <any>{errMsg: 'removeSavedFile:ok'}
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `removeSavedFile${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  let {filePath, success, fail, complete}: any = opts

  return FileSystem.deleteAsync(filePath)
    .then((obj) => {
      success && success(res)
      complete && complete(res)
      return obj
    }).catch(e => {
      res.errMsg = `removeSavedFile:fail. ${e.message}`
      fail && fail(res)
      complete && complete(res)
      throw res
    })
}

/**
 * @todo
 * 新开页面打开文档
 * @param opts
 * @param opts.filePath 文件路径，可通过 downloadFile 获得
 * @param opts.fileType 文件类型，指定文件类型打开文件
 */
export function openDocument (opts = {}) {
  console.log('not finished')
}

/**
 * 获取该小程序下已保存的本地缓存文件列表
 * @param opts
 * @param {string} opts.filePath 文件路径
 */
export async function getSavedFileList (opts = {}) {
  const res = <any>{errMsg: 'getSavedFileList:ok'}
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  let {success, fail, complete}: any = opts
  let fileList = <any>[]
  try {
    const fileNameList = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory as string)
    fileNameList.forEach(async (fileName, index) => {
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + fileName)
      if (fileInfo.isDirectory) {
        fileList.push({
          filePath: fileInfo.uri,
          size: fileInfo.size,
          createTime: fileInfo.modificationTime
        })
      }
    })
    res.fileList = fileList
    success && success(res)
    complete && complete(res)
    return res
  } catch (e) {
    res.errMsg = `getSavedFileList:fail. ${e.message}`
    fail && fail(res)
    complete && complete(res)
    throw res
  }
}

/**
 * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo() 接口。
 * @param opts
 */
export async function getSavedFileInfo (opts = {}) {
  const res = <any>{errMsg: 'getSavedFileInfo:ok'}
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getSavedFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  let {filePath, digestAlgorithm = 'md5', success, fail, complete}: any = opts

  try {
    const obj = await FileSystem.getInfoAsync(filePath, {md5: true})
    console.log(obj)
    if (!obj.exists) {
      throw new Error('filePath not exists')
    }
    res.size = obj.size
    res.createTime = obj.modificationTime
    success && success(res)
    complete && complete(res)
    return res
  } catch (e) {
    res.errMsg = `getSavedFileInfo:fail. ${e.message}`
    fail && fail(res)
    complete && complete(res)
    throw res
  }
}

/**
 * 获取文件信息
 * @param opts
 * @param {string} opts.filePath -  本地文件路径
 * @param {string} [opts.digestAlgorithm] - 计算文件摘要的算法
 */
export async function getFileInfo (opts = {}) {
  const res = <any>{errMsg: 'getFileInfo:ok'}
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  let {filePath, digestAlgorithm = 'md5', success, fail, complete}: any = opts

  try {
    const obj = await FileSystem.getInfoAsync(filePath, {md5: true})
    if (!obj.exists) {
      throw new Error('filePath not exists')
    }
    res.size = obj.size
    res.md5 = obj.md5
    success && success(res)
    complete && complete(res)
    return res
  } catch (e) {
    res.errMsg = `getFileInfo:fail. ${e.message}`
    fail && fail(res)
    complete && complete(res)
    throw res
  }
}

/**
 * @todo
 * 获取全局唯一的文件管理器
 */
export function getFileSystemManager () {
  console.log('not finished')
}
