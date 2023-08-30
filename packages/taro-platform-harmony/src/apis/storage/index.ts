/**
 * 从API Version 6开始，该模块不再维护，可以使用模块@ohos.data.storage。在API Version 9后，推荐使用新模块@ohos.data.preferences。
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-apis-data-preferences-0000001427745052-V3
*/
import bundleManager from '@ohos.bundle.bundleManager'
import dataPreferences from '@ohos.data.preferences'
import hilog from '@ohos.hilog'
import { Current } from '@tarojs/runtime'

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../utils'

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

const preferencesPromise = (Current as any).contextPromise
  .then((context) => {
    return bundleManager
      .getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION)
      .then(data => {
        return dataPreferences
          .getPreferences(context, `${data.appInfo.uid}Store`)
      })
  })
  .catch((error) => {
    hilog.error(0x0000, 'TaroFailedTag', 'Failed to load the storage. Cause: %{public}s', error.code ? JSON.stringify(error) : error.message || error)
  })

async function getItem (key: string): Promise<{ result: boolean, data?: number | string | boolean }> {
  try {
    const preferences = await preferencesPromise
    const item = await preferences.get(key, null)

    return { result: true, data: item }
  } catch (error) {
    return { result: false }
  }
}

const storageSchema = {
  key: 'String'
}

export function getStorage (options: IGetStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('getStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    getItem(options.key).then(({ result, data }) => {
      const res: Record<string, any> = { errMsg: 'getStorage:ok' }
    
      if (result) {
        res.data = data
        callAsyncSuccess(resolve, res, options)
      } else {
        res.errMsg = 'getStorage:fail data not found'
        callAsyncFail(reject, res, options)
      }
    })
  })
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

    preferencesPromise.then(async (preferences) => {
      await preferences.put(key, data)
      await preferences.flush()

      callAsyncSuccess(resolve, res, options)
    })
  })
}

export function removeStorage (options: IRemoveStorageParams) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('removeStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { key } = options

    preferencesPromise.then(async (preferences) => {
      await preferences.delete(key)
      await preferences.flush()

      const res = { errMsg: 'removeStorage:ok' }
      callAsyncSuccess(resolve, res, options)
    })
  })
}

export function clearStorage (options: IAsyncParams) {
  return new Promise(resolve => {
    preferencesPromise.then(async (preferences) => {
      await preferences.clear()
      await preferences.flush()

      const res = { errMsg: 'clearStorage:ok' }
      callAsyncSuccess(resolve, res, options)
    })
  })
}
export const getStorageSync = temporarilyNotSupport('getStorageSync', 'getStorage')
export const setStorageSync = temporarilyNotSupport('setStorageSync', 'setStorage')
export const clearStorageSync = temporarilyNotSupport('clearStorageSync', 'clearStorage')
export const removeStorageSync = temporarilyNotSupport('removeStorageSync', 'removeStorage')
