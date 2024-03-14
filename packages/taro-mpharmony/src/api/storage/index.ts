import Taro from '@tarojs/api'

import { shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'
import native from '../NativeApi'
import { displayExecRes, handleData } from './util'

/**
 * 创建缓存管理器
 *
 * @canNotUse createCacheManager
 */
export * from './background-fetch'


// 周期性更新
export const createCacheManager = /* @__PURE__ */ temporarilyNotSupport('createCacheManager')


export const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
  const status = native.setStorageSync({ key, data: JSON.stringify(handleData(data)) })
  displayExecRes(status, setStorageSync.name)
}

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
      data: data,
      success: (res: any) => {
        handle.success({ errMsg: res.errMsg }, { resolve,reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve,reject })
      }
    })
  })
}

export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

export const removeStorageSync: typeof Taro.removeStorageSync = (key: string) => {
  const status = native.removeStorageSync({ key })
  displayExecRes(status, removeStorageSync.name)
}

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
        handle.success({ errMsg: res.errMsg },{ resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg },{ resolve,reject })
      }
    })
  })
}

// @ts-ignore
export const getStorageSync: typeof Taro.getStorageSync = (key) => {
  const status = native.getStorageSync({ key })

  if (status.done) {
    let item: any
    try {
      item = JSON.parse(status.data)
    } catch (e) {
      item = status.data
    }
    return item
  }
  return ''
}

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
    complete
  })

  return new Promise((resolve, reject) => {
    native.getStorage({
      key: key,
      success: (res: any) => {
        let item: any
        try {
          item = JSON.parse(res.data)
        } catch (e) {
          item = res.data
        }
        const result: Taro.getStorage.SuccessCallbackResult<T> = {
          data: item,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve,reject })
      }
    })
  })

}


export const getStorageInfoSync: typeof Taro.getStorageInfoSync = () => {
  const res: Taro.getStorageInfoSync.Option = {
    keys: [],
    limitSize: NaN,
    currentSize: NaN
  }
  const status = native.getStorageInfoSync({ key: '' })

  if (status.done) {
    res.keys = JSON.parse(status.data)
    return res
  }
  return res
}

export const getStorageInfo: typeof Taro.getStorageInfo = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getStorageInfo.SuccessCallbackOption>({
    name: 'getStorageInfo',
    success,
    fail,
    complete
  })

  return new Promise((resolve, reject) => {
    native.getStorageInfo({
      success: (res: any) => {
        const result: Taro.getStorageInfoSync.Option = {
          keys: JSON.parse(res.data),
          limitSize: NaN,
          currentSize: NaN,
        }
        handle.success(result,{ resolve,reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve, reject })
      }
    })
  })
}


export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')

export const clearStorageSync: typeof Taro.clearStorageSync = () => {
  const status = native.clearStorageSync({ key: '' })
  displayExecRes(status, clearStorageSync.name)
}

export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })

  return new Promise((resolve, reject) => {
    native.clearStorage({
      success: () => {
        handle.success({ errMsg: 'ok' },{ reject,resolve })
      },
      fail: (err:any) => {
        handle.fail({ errMsg: err.errMsg },{ reject,resolve })
      }
    })
  })
}

export const batchSetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchSetStorageSync')
export const batchSetStorage = /* @__PURE__ */ temporarilyNotSupport('batchSetStorage')
export const batchGetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchGetStorageSync')
export const batchGetStorage = /* @__PURE__ */ temporarilyNotSupport('batchGetStorage')

export * from './background-fetch'
