import Taro from '@tarojs/api'
import { shouldBeObject, getParameterError } from '../utils'
import { MethodHandler } from '../utils/handler'

const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
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

const setStorage: typeof Taro.setStorage = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setStorage${isObject.msg}` }
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

const getStorage: typeof Taro.getStorage = <T>(options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `getStorage${isObject.msg}` }
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

const getStorageSync: typeof Taro.getStorageSync = (key) => {
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

const getStorageInfoSync: typeof Taro.getStorageInfoSync = () => {
  const res: Taro.getStorageInfoSync.Option = {
    keys: Object.keys(localStorage),
    limitSize: Number(null),
    currentSize: Number(null)
  }
  return res
}

const getStorageInfo: typeof Taro.getStorageInfo = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getStorageInfo.SuccessCallbackOption>({ name: 'getStorageInfo', success, fail, complete })
  return handle.success(getStorageInfoSync())
}

const removeStorageSync: typeof Taro.removeStorageSync = (key: string) => {
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

const removeStorage: typeof Taro.removeStorage = (options: Taro.removeStorage.Option) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `removeStorage${isObject.msg}` }
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

const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })
  localStorage.clear()
  return handle.success()
}

const clearStorageSync: typeof Taro.clearStorageSync = () => {
  clearStorage()
}

export {
  setStorage,
  setStorageSync,
  getStorage,
  getStorageSync,
  getStorageInfo,
  getStorageInfoSync,
  removeStorage,
  removeStorageSync,
  clearStorage,
  clearStorageSync
}
