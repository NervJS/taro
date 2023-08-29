/**
 * 从API Version 6开始，该模块不再维护，可以使用模块@ohos.data.storage。在API Version 9后，推荐使用新模块@ohos.data.preferences。
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-apis-data-preferences-0000001427745052-V3
*/

import featureAbility from '@ohos.ability.featureAbility'
import dataStorage from '@ohos.data.storage'
import hilog from '@ohos.hilog'

// import app from '@system.app'
import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

import type { IAsyncParams } from '../utils/types'

interface IGetStorageParams extends IAsyncParams {
  key: string
}
interface ISetStorageParams extends IAsyncParams {
  key: string
  data: number | string | boolean
}

interface IRemoveStorageParams extends IAsyncParams {
  key: string
}

// const appInfo = app.getInfo()
// const appID = appInfo?.appID
const context = featureAbility.getContext()

let storage
context.getFilesDir((error, data) => {
  if (error) {
    hilog.error(0x0000, 'TaroFailedTag', 'Failed to load the storage. Cause: %{public}s', error.code ? JSON.stringify(error) : error.message || error)
  } else {
    const storagePath = `${data}/api_storage`
    storage = dataStorage.getStorageSync(storagePath)
  }
})

function getItem (key: string): { result: boolean, data?: number | string | boolean } {
  try {
    const item = JSON.parse(storage.getSync(key, null))
    if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
      return { result: true, data: item.data }
    } else {
      return { result: false }
    }
  } catch (error) {
    return { result: false }
  }
}

const storageSchema = {
  key: 'String'
}

export function getStorageSync (key: string) {
  validateParams('getStorageSync', [key], ['string'])

  const res = getItem(key)
  if (res.result) return res.data
  return ''
}

export function getStorage (options: IGetStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('getStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { result, data } = getItem(options.key)
    const res: Record<string, any> = { errMsg: 'getStorage:ok' }
    if (result) {
      res.data = data
      callAsyncSuccess(resolve, res, options)
    } else {
      res.errMsg = 'getStorage:fail data not found'
      callAsyncFail(reject, res, options)
    }
  })
}

export function setStorageSync (key: string, data: number | string | boolean) {
  validateParams('setStorageSync', [key], ['string'])
  const obj = { data }
  storage.putSync(key, JSON.stringify(obj))
  storage.flushSync()
}

export function setStorage (options: ISetStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('setStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { key, data } = options
    const res = { errMsg: 'setStorage:ok' }

    setStorageSync(key, data)

    callAsyncSuccess(resolve, res, options)
  })
}

export function removeStorageSync (key: string) {
  validateParams('removeStorageSync', [key], ['string'])
  storage.deleteSync(key)
}

export function removeStorage (options: IRemoveStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('removeStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    removeStorageSync(options.key)

    const res = { errMsg: 'removeStorage:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

export function clearStorageSync () {
  storage.clearSync()
}

export function clearStorage (options: IAsyncParams) {
  return new Promise(resolve => {
    clearStorageSync()

    const res = { errMsg: 'clearStorage:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}
