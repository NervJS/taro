/**
 * 从API Version 6开始，该模块不再维护，可以使用模块@ohos.data.storage。在API Version 9后，推荐使用新模块@ohos.data.preferences。
 * https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-apis-data-preferences-0000001427745052-V3
*/
import bundleManager from '@ohos.bundle.bundleManager'
import distributedKVStore from '@ohos.data.distributedKVStore'
import { Current } from '@tarojs/runtime'

import { temporarilyNotSupport, validateParams } from '../utils'
import { MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

let context
let kvManager: distributedKVStore.KVManager
let kvStore: distributedKVStore.SingleKVStore
let kvStorePromise: Promise<void>

(Current as any).contextPromise.then((ctx) => {
  context = ctx
  const kvManagerConfig: distributedKVStore.KVManagerConfig = {
    context: context,
    bundleName: 'com.example.taro'
  }

  try {
    // 创建KVManager实例
    kvManager = distributedKVStore.createKVManager(kvManagerConfig)
    // 继续创建获取数据库
    const options: distributedKVStore.Options = {
      createIfMissing: true,
      encrypt: false,
      backup: false,
      autoSync: false,
      // kvStoreType不填时，默认创建多设备协同数据库
      kvStoreType: distributedKVStore.KVStoreType.SINGLE_VERSION,
      // 多设备协同数据库：kvStoreType: distributedKVStore.KVStoreType.DEVICE_COLLABORATION,
      securityLevel: distributedKVStore.SecurityLevel.S1
    }

    const data = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION)
    kvStorePromise = new Promise(resolve => {
      kvManager.getKVStore<distributedKVStore.SingleKVStore>(`${data.appInfo.uid}Store`, options, (err, store: distributedKVStore.SingleKVStore) => {
        if (err) {
          console.error(`Failed to get KVStore: Code:${err.code},message:${err.message}`)
          return
        }
        kvStore = store
        // 请确保获取到键值数据库实例后，再进行相关数据操作
        resolve()
      })
    })
  } catch (e) {
    console.error(`Failed to create KVManager. Code:${e.code},message:${e.message}`)
  }

  return context
})

const storageSchema = {
  key: 'String'
}

function checkContextExist (api: string, isAsync = false) {
  if (!context) {
    const message = `${api} 调用失败，Taro 不支持过早地调用 ${api}，请确保页面已经渲染完成再调用此 API`
    if (isAsync) {
      return {
        isExist: false,
        error: Promise.reject(new Error(message))
      }
    } else {
      console.warn(message)

      return {
        isExist: false,
      }
    }
  }

  return {
    isExist: true,
  }
}

export function getStorage<T = any> (options: Taro.getStorage.Option<T>) {
  const name = 'getStorage'
  const { isExist, error } = checkContextExist(name, true)

  if (!isExist) {
    return error
  }

  const { key, success, fail, complete } = options || {}
  const handle = new MethodHandler<{data: any}>({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    kvStorePromise.then(() => {
      try {
        validateParams(name, options, storageSchema)
      } catch (error) {
        const res = { errMsg: error.message }
        return handle.fail(res, { resolve, reject })
      }

      kvStore = kvStore as distributedKVStore.SingleKVStore
      kvStore.get(key, (err, data) => {
        if (err) {
          handle.fail({ errMsg: `Failed to get data. Code:${err.code},message:${err.message}` }, { resolve, reject })
          return
        }

        handle.success({ data }, { resolve, reject })
      })
    })
  })
}

export function setStorage (options: Taro.setStorage.Option) {
  const name = 'setStorage'
  const { isExist, error } = checkContextExist(name, true)

  if (!isExist) {
    return error
  }

  const { key, data, success, fail, complete } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    kvStorePromise.then(() => {
      try {
        validateParams(name, options, storageSchema)
      } catch (error) {
        const res = { errMsg: error.message }
        return handle.fail(res, { resolve, reject })
      }

      kvStore = kvStore as distributedKVStore.SingleKVStore
      kvStore.put(key, data, (err) => {
        if (err) {
          handle.fail({ errMsg: `Failed to put data. Code:${err.code},message:${err.message}` }, { resolve, reject })
          return
        }

        handle.success({}, { resolve, reject })
      })
    })
  })
}

export function removeStorage (options: Taro.removeStorage.Option) {
  const name = 'removeStorage'
  const { isExist, error } = checkContextExist(name, true)

  if (!isExist) {
    return error
  }

  const { key, success, fail, complete } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    kvStorePromise.then(() => {
      try {
        validateParams(name, options, storageSchema)
      } catch (error) {
        const res = { errMsg: error.message }
        return handle.fail(res, { resolve, reject })
      }

      kvStore = kvStore as distributedKVStore.SingleKVStore
      kvStore.delete(key, (err) => {
        if (err) {
          handle.fail({ errMsg: `Failed to delete data. Code:${err.code},message:${err.message}` }, { resolve, reject })
          return
        }

        handle.success({}, { resolve, reject })
      })
    })
  })
}

export const getStorageInfoSync = temporarilyNotSupport('getStorageInfoSync')
export const getStorageInfo = temporarilyNotSupport('getStorageInfo')

export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')
export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

export const batchSetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchSetStorageSync')
export const batchSetStorage = /* @__PURE__ */ temporarilyNotSupport('batchSetStorage')
export const batchGetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchGetStorageSync')
export const batchGetStorage = /* @__PURE__ */ temporarilyNotSupport('batchGetStorage')

export const clearStorage = temporarilyNotSupport('clearStorage')
export const getStorageSync = temporarilyNotSupport('getStorageSync', 'getStorage')
export const setStorageSync = temporarilyNotSupport('setStorageSync', 'setStorage')
export const clearStorageSync = temporarilyNotSupport('clearStorageSync', 'clearStorage')
export const removeStorageSync = temporarilyNotSupport('removeStorageSync', 'removeStorage')

export * from './background-fetch'
export * from './cache-manager'
