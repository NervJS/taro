import Taro from '@tarojs/taro'
import { isString } from '@tarojs/shared'
import { getCacheDir, notSupportAsync } from './utils'
import { getFileSystemManager } from './manager'
import { validateParams, callAsyncSuccess, callAsyncFail } from '../utils'

const saveFileSchema = {
  tempFilePath: 'String'
}

async function parseDestFilePath (srcPath: string, destPath: string | undefined) : Promise<string> {
  if (isString(destPath) && destPath.length > 0) {
    return destPath
  }

  const srcName = srcPath.split('/').pop()
  const filesDir = await getCacheDir()
  return `${filesDir}/${srcName}`
}

function saveFileToDisk (option: Taro.saveFileToDisk.Option): Promise<TaroGeneral.CallbackResult> {
  return notSupportAsync('saveFileToDisk', option)
}

function saveFile (option: Taro.saveFile.Option): Promise<TaroGeneral.CallbackResult> {
  return new Promise((resolve, reject) => {
    try {
      validateParams('saveFile', option, saveFileSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, option)
    }
    parseDestFilePath(option.tempFilePath, option.filePath).then((destPath) => {
      const fileSystemManager = getFileSystemManager()
      fileSystemManager.rename({
        oldPath: option.tempFilePath,
        newPath: destPath,
        success: () => {
          callAsyncSuccess(resolve, { savedFilePath: destPath }, option)
        },
        fail: (res) => {
          callAsyncFail(reject, res, option)
        }
      })
    }).catch((error) => {
      const res = { errMsg: error.message ? error.message : error }
      return callAsyncFail(reject, res, option)
    })
  })
}

export {
  saveFileToDisk,
  saveFile,
  getFileSystemManager
}
