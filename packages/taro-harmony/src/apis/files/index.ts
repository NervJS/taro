import Taro from '@tarojs/taro'
import { isString } from '@tarojs/shared'
import { getFileSystemManager } from './manager'
import { validateParams, callAsyncSuccess, callAsyncFail } from '../utils'

const ability_featureAbility = require('@ohos.ability.featureAbility')

const saveFileSchema = {
  tempFilePath: 'String'
}

function notSupport (apiName, option): Promise<TaroGeneral.CallbackResult> {
  return new Promise((resolve, reject) => {
    const errMsg = `不支持 API ${apiName}`
    if (process.env.NODE_ENV !== 'production') {
      console.error(errMsg)
      return callAsyncFail(reject, { errMsg }, option)
    } else {
      console.warn(errMsg)
      return callAsyncSuccess(resolve, { errMsg }, option)
    }
  })
}

async function getFilesDir (): Promise<string> {
  const context = ability_featureAbility.getContext()
  return await context.getFilesDir()
}

async function parseDestFilePath (srcPath: string, destPath: string | undefined) : Promise<string> {
  if (isString(destPath) && destPath.length > 0) {
    return destPath
  }

  const srcName = srcPath.split('/').pop()
  const filesDir = await getFilesDir()
  return `${filesDir}/${srcName}`
}

function saveFileToDisk (option: Taro.saveFileToDisk.Option): Promise<TaroGeneral.CallbackResult> {
  return notSupport('saveFileToDisk', option)
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
      fileSystemManager.copyFile({
        destPath,
        srcPath: option.tempFilePath,
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
