import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

function getItem (key) {
  let item
  try {
    item = JSON.parse(localStorage.getItem(key) || '')
  } catch (e) {} // eslint-disable-line no-empty

  // 只返回使用 Taro.setStorage API 存储的数据
  if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
    return { result: true, data: item.data }
  } else {
    return { result: false }
  }
}

/** 
 * Taro.setStorage 的同步版本
 * 
 * @canUse setStorageSync
 * @__object [key, data]
*/
export const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
  if (typeof key !== 'string') {
    console.error(
      getParameterError({
        name: 'setStorage',
        correct: 'String',
        wrong: key,
      })
    )
    return
  }

  const type = typeof data
  let obj = {}

  if (type === 'symbol') {
    obj = { data: '' }
  } else {
    obj = { data }
  }
  localStorage.setItem(key, JSON.stringify(obj))
}

/**
 * 将数据存储在本地缓存中指定的 key 中
 * 
 * @canUse setStorage
 * @__object [data, key]
 */
export const setStorage: typeof Taro.setStorage = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { key, data, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setStorage', success, fail, complete })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key,
      }),
    })
  }

  setStorageSync(key, data)
  return handle.success()
}

/**
 * 根据 URL 销毁存在内存中的数据
 * 
 * @canNotUse revokeBufferURL
 */
export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

/** 
 * Taro.removeStorage 的同步版本
 * 
 * @canUse removeStorageSync
*/
export const removeStorageSync: typeof Taro.removeStorageSync = (key: string) => {
  if (typeof key !== 'string') {
    console.error(
      getParameterError({
        name: 'removeStorage',
        correct: 'String',
        wrong: key,
      })
    )
    return
  }

  localStorage.removeItem(key)
}

/** 
 * 从本地缓存中移除指定 key
 * 
 * @canUse removeStorage
 * @__object [key]
*/
export const removeStorage: typeof Taro.removeStorage = (options: Taro.removeStorage.Option) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `removeStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { key, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'removeStorage', success, fail, complete })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key,
      }),
    })
  }

  removeStorageSync(key)
  return handle.success()
}

/** 
 * Taro.getStorage 的同步版本
 * 
 * @canUse getStorageSync
*/
export const getStorageSync: typeof Taro.getStorageSync = (key) => {
  if (typeof key !== 'string') {
    console.error(
      getParameterError({
        name: 'getStorageSync',
        correct: 'String',
        wrong: key,
      })
    )
    return
  }

  const res = getItem(key)
  if (res.result) return res.data

  return ''
}

/** 
 * Taro.getStorageInfo 的同步版本
 * 
 * @canUse getStorageInfoSync
 * @__return [currentSize, keys, limitSize]
*/
export const getStorageInfoSync: typeof Taro.getStorageInfoSync = () => {
  const res: Taro.getStorageInfoSync.Option = {
    keys: Object.keys(localStorage),
    limitSize: NaN,
    currentSize: NaN,
  }
  return res
}

/** 
 * 异步获取当前storage的相关信息
 * 
 * @canUse getStorageInfo
 * @__success [currentSize, keys, limitSize]
*/
export const getStorageInfo: typeof Taro.getStorageInfo = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getStorageInfo.SuccessCallbackOption>({
    name: 'getStorageInfo',
    success,
    fail,
    complete,
  })
  return handle.success(getStorageInfoSync())
}

/** 
 * 从本地缓存中异步获取指定 key 的内容
 * 
 * @canUse getStorage
 * @__object [key]
 * @__success [data]
*/
export const getStorage: typeof Taro.getStorage = <T>(options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { key, success, fail, complete } = options
  const handle = new MethodHandler<Taro.getStorage.SuccessCallbackResult<T>>({
    name: 'getStorage',
    success,
    fail,
    complete,
  })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key,
      }),
    })
  }

  const { result, data } = getItem(key)
  if (result) {
    return handle.success({ data })
  } else {
    return handle.fail({
      errMsg: 'data not found',
    })
  }
}

/**
 * 根据传入的 buffer 创建一个唯一的 URL 存在内存中
 * 
 * @canNotUse createBufferURL
 */
export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')

/** 
 * Taro.clearStorage 的同步版本
 * 
 * @canUse clearStorageSync
*/
export const clearStorageSync: typeof Taro.clearStorageSync = () => {
  localStorage.clear()
}

/** 
 * 清理本地数据缓存
 * 
 * @canUse clearStorage
*/
export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })
  clearStorageSync()
  return handle.success()
}

/**
 * 创建缓存管理器
 * 
 * @canNotUse createCacheManager
 */
export const createCacheManager = /* @__PURE__ */ temporarilyNotSupport('createCacheManager')

export * from './background-fetch'

/**
 * CacheManager实例
 * 
 * @canNotUse CacheManager
 */