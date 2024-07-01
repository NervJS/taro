import Taro from '@tarojs/api'

import native from '../NativeApi'
import { shouldBeObject, temporarilyNotSupport } from '../utils'
import { MethodHandler } from '../utils/handler'
import { handleData } from './util'

/**
 * 创建缓存管理器
 *
 * @canNotUse createCacheManager
 */
export * from './background-fetch'

// 周期性更新
export const createCacheManager = /* @__PURE__ */ temporarilyNotSupport('createCacheManager')

/**
 * Taro.setStorage 的同步版本
 *
 * @canUse setStorageSync
 * @__object [key, data]
 */
export const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
  // @ts-ignore
  native.setStorageSync(
    {
      key: key,
      data: JSON.stringify(handleData(data))
    })
  // displayExecRes(status, setStorageSync.name)
}

/**
 * 将数据存储在本地缓存中指定的 key 中
 *
 * @canUse setStorage
 * @__object [data, key]
 */
// @ts-ignore
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

  return new Promise((resolve, reject) => {
    native.setStorage({
      key: key,
      data: JSON.stringify(handleData(data)),
      success: (res: any) => {
        handle.success({ errMsg: res.errMsg }, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve, reject })
      },
    })
  })
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
  // @ts-ignore
  native.removeStorageSync({ key })
  // displayExecRes(status, removeStorageSync.name)
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

  return new Promise((resolve, reject) => {
    native.removeStorage({
      key: key,
      success: (res: any) => {
        handle.success({ errMsg: res.errMsg }, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve, reject })
      },
    })
  })
}

/**
 * Taro.getStorage 的同步版本
 *
 * @canUse getStorageSync
 */
// @ts-ignore
export const getStorageSync: typeof Taro.getStorageSync = (key) => {
  const res = native.getStorageSync({ key })
  // 存储数据时，会把真实的数据包裹成{data: xxx} 的json格式
  let item: any
  try {
    item = JSON.parse(res.data)
  } catch (e) {
    item = { data: '' }
  }
  return item.data
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

  return new Promise((resolve, reject) => {
    native.getStorage({
      key: key,
      success: (res: any) => {
        let item: any
        try {
          item = JSON.parse(res.data)
        } catch (e) {
          item = { data: '' }
        }
        const result: Taro.getStorage.SuccessCallbackResult<T> = {
          data: item.data,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve, reject })
      },
    })
  })
}

/**
 * Taro.getStorageInfo 的同步版本
 *
 * @canNotUse getStorageInfoSync
 * @__return [currentSize, keys, limitSize]
 */
export const getStorageInfoSync = temporarilyNotSupport('getStorageInfoSync')

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

  return new Promise((resolve, reject) => {
    native.getStorageInfo({
      success: (res: any) => {
        const result: Taro.getStorageInfoSync.Option = {
          keys: res.keys,
          limitSize: NaN,
          currentSize: NaN,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve, reject })
      },
    })
  })
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
  // @ts-ignore
  native.clearStorageSync({ key: '' })
  // displayExecRes(status, clearStorageSync.name)
}

/**
 * 清除storage信息
 *
 * @canUse clearStorage
 */
export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })

  return new Promise((resolve, reject) => {
    native.clearStorage({
      success: () => {
        handle.success({ errMsg: 'ok' }, { reject, resolve })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { reject, resolve })
      },
    })
  })
}

// @ts-ignore
export * from './background-fetch'
