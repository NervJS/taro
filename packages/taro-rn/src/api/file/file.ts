import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'
import { func } from 'prop-types'
import { shouleBeObject } from '../utils'

/**
 * 保存文件到本地。注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用
 * @param opts
 * @param {string} opts.tempFilePath 需要保存的文件的临时路径
 */
export function saveFile (opts) {

}

/**
 * 删除本地缓存文件
 * @param opts
 * @param {string} opts.filePath 需要删除的文件路径
 */
export function removeSavedFile (opts) {

}

/**
 * 新开页面打开文档
 * @param opts
 * @param opts.filePath 文件路径，可通过 downloadFile 获得
 * @param opts.fileType 文件类型，指定文件类型打开文件
 */
export function openDocument (opts) {

}

/**
 * 获取该小程序下已保存的本地缓存文件列表
 * @param opts
 * @param {string} opts.filePath 文件路径
 */
export function getSavedFileList (opts) {

}

/**
 * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo() 接口。
 * @param opts
 */
export function getSavedFileInfo (opts) {

}

/**
 * 获取文件信息
 * @param opts
 * @param {string} opts.filePath -  本地文件路径
 * @param {string} [opts.digestAlgorithm] - 计算文件摘要的算法
 */
export function getFileInfo (opts) {
  const res = <any>{errMsg: 'openUrl:ok'}
  const isObject = shouleBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  let {filePath, digestAlgorithm = 'md5', success, fail, complete} = opts

  return FileSystem.getInfoAsync(filePath, {md5: true})
    .then((obj) => {
      res.size = obj.size
      res.md5 = obj.md5
      success && success(res)
      complete && complete(res)
      return {
        size: res.size,
        digest: res.md5
      }
    }).catch(e => {
      res.errMsg = `openUrl:fail. ${e.message}`
      fail && fail(res)
      complete && complete(res)
    })
}

/**
 * 获取全局唯一的文件管理器
 */
export function getFileSystemManager () {

}
