import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

function getItem (key) {
  let item
  try {
    item = JSON.parse(localStorage.getItem(key) || '')
  } catch (e) {}

  // 只返回使用 Taro.setStorage API 存储的数据
  if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
    return { result: true, data: item.data }
  } else {
    return { result: false }
  }
}

// 数据缓存
export const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'setStorage',
      correct: 'String',
      wrong: key
    }))
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
        wrong: key
      })
    })
  }

  setStorageSync(key, data)
  return handle.success()
}

export const revokeBufferURL = temporarilyNotSupport('revokeBufferURL')

export const removeStorageSync: typeof Taro.removeStorageSync = (key: string) => {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'removeStorage',
      correct: 'String',
      wrong: key
    }))
    return
  }

  localStorage.removeItem(key)
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

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key
      })
    })
  }

  removeStorageSync(key)
  return handle.success()
}

export const getStorageSync: typeof Taro.getStorageSync = (key) => {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'getStorageSync',
      correct: 'String',
      wrong: key
    }))
    return
  }

  const res = getItem(key)
  if (res.result) return res.data

  return ''
}

export const getStorageInfoSync: typeof Taro.getStorageInfoSync = () => {
  const res: Taro.getStorageInfoSync.Option = {
    keys: Object.keys(localStorage),
    limitSize: NaN,
    currentSize: NaN
  }
  return res
}

export const getStorageInfo: typeof Taro.getStorageInfo = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getStorageInfo.SuccessCallbackOption>({ name: 'getStorageInfo', success, fail, complete })
  return handle.success(getStorageInfoSync())
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
  const handle = new MethodHandler<Taro.getStorage.SuccessCallbackResult<T>>({ name: 'getStorage', success, fail, complete })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key
      })
    })
  }

  const { result, data } = getItem(key)
  if (result) {
    return handle.success({ data })
  } else {
    return handle.fail({
      errMsg: 'data not found'
    })
  }
}

export const createBufferURL = temporarilyNotSupport('createBufferURL')

export const clearStorageSync: typeof Taro.clearStorageSync = () => {
  localStorage.clear()
}

export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })
  clearStorageSync()
  return handle.success()
}

export * from './background-fetch'
