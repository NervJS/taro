/**
 * 从API Version 6开始，该模块不再维护，可以使用模块@ohos.data.storage。在API Version 9后，推荐使用新模块@ohos.data.preferences。
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-apis-data-preferences-0000001427745052-V3
*/
import bundleManager from '@ohos.bundle.bundleManager'
import dataPreferences from '@ohos.data.preferences'
import hilog from '@ohos.hilog'
import { Current } from '@tarojs/runtime'

import { temporarilyNotSupport, validateParams } from '../utils'
import { MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

let context
let preferences: any

(Current as any).contextPromise.then((ctx) => {
  context = ctx
  return context
})

function getPreferences () {
  try {
    if (!preferences) {
      const data = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION)
      preferences = dataPreferences.getPreferencesSync(context, { name: `${data.appInfo.uid}Store` })
    }
  } catch (error) {
    hilog.error(0x0000, 'TaroFailedTag', 'Failed to load the storage. Cause: %{public}s', error.code ? JSON.stringify(error) : error.message || error)
  }

  return preferences
}

const storageSchema = {
  key: 'String'
}

export function getStorage<T = any> (options: Taro.getStorage.Option<T>) {
  const { key, success, fail, complete } = options || {}
  const handle = new MethodHandler<{data: any}>({ name: 'getStorage', success, fail, complete })

  return new Promise((resolve, reject) => {
    try {
      validateParams('getStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return handle.fail(res, { resolve, reject })
    }

    const preferences = getPreferences()
    
    if (!preferences) return handle.fail({}, { resolve, reject })

    const data = preferences.getSync(key, null)
    if (data) {
      return handle.success({ data }, { resolve, reject })
    } else {
      return handle.success({ errMsg: 'data not found' }, { resolve, reject })
    }
  })
}

export function getStorageSync (key: string) {
  if (!key) {
    throw new Error('getStorageSync:fail parameter error: parameter should be String')
  }

  const preferences = getPreferences()
  
  if (!preferences) {
    throw new Error('getStorageSync:fail:preferences is null')
  }

  const data = preferences.getSync(key, null)
  if (data) {
    return data
  } else {
    throw new Error('data not found')
  }
}

export function setStorage (options: Taro.setStorage.Option) {
  const { key, data, success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'setStorage', success, fail, complete })

  return new Promise((resolve, reject) => {
    try {
      validateParams('setStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return handle.fail(res, { resolve, reject })
    }

    const preferences = getPreferences()

    if (!preferences) return handle.fail({}, { resolve, reject })

    preferences.putSync(key, data)
    preferences.flush()

    return handle.success({}, { resolve, reject })
  })
}

export function setStorageSync (key: string, data: any) {
  if (!key) {
    throw new Error('setStorageSync:fail key error: key should be String')
  }

  const preferences = getPreferences()
  
  if (!preferences) {
    throw new Error('setStorageSync:fail:preferences is null')
  }

  preferences.putSync(key, data)
  preferences.flush()
}

export function removeStorage (options: Taro.removeStorage.Option) {
  const { key, success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'removeStorage', success, fail, complete })

  return new Promise((resolve, reject) => {
    try {
      validateParams('removeStorage', options, storageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return handle.fail(res, { resolve, reject })
    }

    const preferences = getPreferences()

    if (!preferences) return handle.fail({}, { resolve, reject })

    preferences.deleteSync(key)
    preferences.flush()

    return handle.success({}, { resolve, reject })
  })
}

export function removeStorageSync (key: string) {
  if (!key) {
    throw new Error('removeStorageSync:fail key error: key should be String')
  }

  const preferences = getPreferences()
  
  if (!preferences) {
    throw new Error('removeStorageSync:fail:preferences is null')
  }

  preferences.deleteSync(key)
  preferences.flush()
}

export function clearStorage (options: Taro.clearStorage.Option) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })

  return new Promise((resolve, reject) => {
    const preferences = getPreferences()

    if (!preferences) return handle.fail({}, { resolve, reject })

    preferences.clearSync()
    preferences.flush()
    
    return handle.success({}, { resolve, reject })
  })
}

export function clearStorageSync () {
  const preferences = getPreferences()
  
  if (!preferences) {
    throw new Error('clearStorageSync:fail:preferences is null')
  }

  preferences.clearSync()
  preferences.flush()
}

export const getStorageInfoSync = temporarilyNotSupport('getStorageInfoSync')
export const getStorageInfo = temporarilyNotSupport('getStorageInfo')

export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')
export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

export const batchSetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchSetStorageSync')
export const batchSetStorage = /* @__PURE__ */ temporarilyNotSupport('batchSetStorage')
export const batchGetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchGetStorageSync')
export const batchGetStorage = /* @__PURE__ */ temporarilyNotSupport('batchGetStorage')

export * from './background-fetch'
export * from './cache-manager'
