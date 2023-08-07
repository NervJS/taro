/**
 * HarmonyOS 文档：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-fileio-0000001168366687
 *
 * WX 文档：
 * https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.saveFileToDisk.html
 *
 * Taro.js 文档
 * https://taro-docs.jd.com/taro/docs/apis/files/saveFileToDisk
 *
 * HarmonyOS 不支持接口：
 * saveFileToDisk
 *
 * HarmonyOS 差异性接口：
 * openDocument：showMenu、type 选项无效
 * getSavedFileList：返回值 fileList 中的每一项不包含 createTime 属性
 * getSavedFileInfo：返回值不包含 createTime 属性
 */

import document from '@ohos.document'
import fileio from '@ohos.fileio'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'
import { getFileSystemManager, validateSavedFilePath } from './manager'
import { notSupportAsync } from './utils'

const filePathSchema = {
  filePath: 'String'
}

function saveFileToDisk (option: Taro.saveFileToDisk.Option): Promise<any> {
  return notSupportAsync('saveFileToDisk', option)
}

/**
 * HarmonyOS 不支持 showMenu 选项，并且 type 目前仅支持 *，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-document-0000001168936589#section9616125953711
 */
function openDocument (option: Taro.openDocument.Option): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      validateParams('access', option, filePathSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, option)
    }
    document.show(option.filePath, '*', (error) => {
      if (error) {
        const res = { errMsg: error.message ? error.message : error }
        return callAsyncFail(reject, res, option)
      } else {
        callAsyncSuccess(resolve, undefined, option)
      }
    })
  })
}

function saveFile (option: Taro.saveFile.Option): Promise<any> {
  return new Promise((resolve, reject) => {
    const fileSystemManager = getFileSystemManager()
    fileSystemManager.saveFile({
      tempFilePath: option.tempFilePath,
      filePath: option.filePath,
      success: (res) => {
        callAsyncSuccess(resolve, res, option)
      },
      fail: (res) => {
        callAsyncFail(reject, res, option)
      }
    })
  })
}

function removeSavedFile (option: Taro.removeSavedFile.Option): Promise<any> {
  return new Promise((resolve, reject) => {
    const fileSystemManager = getFileSystemManager()
    fileSystemManager.removeSavedFile({
      filePath: option.filePath,
      success: (res) => {
        callAsyncSuccess(resolve, res, option)
      },
      fail: (res) => {
        callAsyncFail(reject, res, option)
      }
    })
  })
}

function getFileInfo (option: Taro.getFileInfo.Option): Promise<Taro.getFileInfo.SuccessCallbackResult | Taro.getFileInfo.FailCallbackResult> {
  return new Promise((resolve, reject) => {
    const fileSystemManager = getFileSystemManager()
    fileSystemManager.getFileInfo({
      filePath: option.filePath,
      success: ({ size }) => {
        fileio.hash(option.filePath, option.digestAlgorithm ?? 'md5').then((digest) => {
          callAsyncSuccess(resolve, { size, digest }, option)
        }).catch((error) => {
          const res = { errMsg: error.message ? error.message : error }
          callAsyncFail(reject, res, option)
        })
      },
      fail: (res) => {
        callAsyncFail(reject, res, option)
      }
    })
  })
}

function getSavedFileList (option?: Taro.getSavedFileList.Option): Promise<Taro.getSavedFileList.SuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    const fileSystemManager = getFileSystemManager()
    fileSystemManager.getSavedFileList({
      success: (res) => callAsyncSuccess(resolve, res, option),
      fail: (res) => callAsyncFail(reject, res, option)
    })
  })
}

function getSavedFileInfo (option: Taro.getSavedFileInfo.Option): Promise<Taro.getSavedFileInfo.SuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    try {
      validateParams('getSavedFileInfo', option, filePathSchema)
      validateSavedFilePath(option.filePath)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, option)
    }
    const fileSystemManager = getFileSystemManager()
    fileSystemManager.getFileInfo({
      filePath: option.filePath,
      success: ({ size }) => callAsyncSuccess(resolve, { size }, option),
      fail: (res) => callAsyncFail(reject, res, option)
    })
  })
}

export {
  getFileInfo,
  getFileSystemManager,
  getSavedFileInfo,
  getSavedFileList,
  openDocument,
  removeSavedFile,
  saveFile,
  saveFileToDisk
}
