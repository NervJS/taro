import Taro from '@tarojs/taro'
import { notSupportAsync } from './utils'
import { getFileSystemManager } from './manager'
import { callAsyncSuccess, callAsyncFail } from '../utils'

function saveFileToDisk (option: Taro.saveFileToDisk.Option): Promise<TaroGeneral.CallbackResult> {
  return notSupportAsync('saveFileToDisk', option)
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

export {
  saveFileToDisk,
  saveFile,
  getFileSystemManager
}
