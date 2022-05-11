import Taro from '@tarojs/taro'
import { notSupportAsync } from './utils'
import { getFileSystemManager } from './manager'
import { validateParams, callAsyncSuccess, callAsyncFail } from '../utils'

const fileio = require('@ohos.fileio')
const document = require('@ohos.document')

const openDocumentSchema = {
  filePath: 'String'
}

function saveFileToDisk (option: Taro.saveFileToDisk.Option): Promise<TaroGeneral.CallbackResult> {
  return notSupportAsync('saveFileToDisk', option)
}

/**
 * HarmonyOS 不支持 showMenu 选项，并且 type 目前仅支持 *，详情参见：
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-document-0000001168936589#section9616125953711
 */
function openDocument (option: Taro.openDocument.Option): Promise<TaroGeneral.CallbackResult> {
  return new Promise((resolve, reject) => {
    try {
      validateParams('access', option, openDocumentSchema)
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

function saveFile (option: Taro.saveFile.Option): Promise<TaroGeneral.CallbackResult> {
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

function removeSavedFile (option: Taro.removeSavedFile.Option): Promise<TaroGeneral.CallbackResult> {
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

export {
  saveFileToDisk,
  saveFile,
  removeSavedFile,
  openDocument,
  getFileInfo,
  getFileSystemManager
}
