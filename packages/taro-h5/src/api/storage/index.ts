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

function serializeItem (data: unknown = '') {
  return JSON.stringify(typeof data === 'symbol' ? { data: '' } : { data })
}

function getKvListError (kvList: unknown, name?: string) {
  if (!Array.isArray(kvList)) {
    return getParameterError({ name, para: 'kvList', correct: 'Array', wrong: kvList })
  }
  for (let i = 0; i < kvList.length; i++) {
    const key = kvList[i]?.key
    if (typeof key !== 'string') {
      return getParameterError({ name, para: `kvList[${i}].key`, correct: 'String', wrong: key })
    }
  }
}

function getKeyListError (keyList: unknown, name?: string) {
  if (!Array.isArray(keyList)) {
    return getParameterError({ name, para: 'keyList', correct: 'Array', wrong: keyList })
  }
  for (let i = 0; i < keyList.length; i++) {
    if (typeof keyList[i] !== 'string') {
      return getParameterError({ name, para: `keyList[${i}]`, correct: 'String', wrong: keyList[i] })
    }
  }
}

function setItems (kvList: Taro.batchSetStorage.kv[]) {
  // 先序列化全部数据，避免部分数据无法序列化时只写入了一部分
  const items = kvList.map(({ key, value }) => [key, serializeItem(value)])
  items.forEach(([key, item]) => localStorage.setItem(key, item))
}

function getItems (keyList: string[]) {
  return keyList.map(key => {
    const { result, data } = getItem(key)
    return result ? data : ''
  })
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

  localStorage.setItem(key, serializeItem(data))
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

  try {
    setStorageSync(key, data)
  } catch (e) {
    return handle.fail({ errMsg: e?.message || String(e) })
  }
  return handle.success()
}

export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

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

  try {
    removeStorageSync(key)
  } catch (e) {
    return handle.fail({ errMsg: e?.message || String(e) })
  }
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
  let res: ReturnType<typeof getStorageInfoSync>
  try {
    res = getStorageInfoSync()
  } catch (e) {
    return handle.fail({ errMsg: e?.message || String(e) })
  }
  return handle.success(res)
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

export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')

export const clearStorageSync: typeof Taro.clearStorageSync = () => {
  localStorage.clear()
}

export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })
  try {
    clearStorageSync()
  } catch (e) {
    return handle.fail({ errMsg: e?.message || String(e) })
  }
  return handle.success()
}

export const batchSetStorageSync: typeof Taro.batchSetStorageSync = (kvList) => {
  const errMsg = getKvListError(kvList, 'batchSetStorageSync')
  if (errMsg) {
    console.error(errMsg)
    return
  }

  setItems(kvList)
}

export const batchSetStorage: typeof Taro.batchSetStorage = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `batchSetStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { kvList, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'batchSetStorage', success, fail, complete })

  const errMsg = getKvListError(kvList)
  if (errMsg) {
    return handle.fail({ errMsg })
  }

  try {
    setItems(kvList)
  } catch (e) {
    return handle.fail({ errMsg: e?.message || String(e) })
  }
  return handle.success()
}

export const batchGetStorageSync: typeof Taro.batchGetStorageSync = (keyList) => {
  const errMsg = getKeyListError(keyList, 'batchGetStorageSync')
  if (errMsg) {
    console.error(errMsg)
    return []
  }

  return getItems(keyList)
}

export const batchGetStorage: typeof Taro.batchGetStorage = <T>(options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `batchGetStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { keyList, success, fail, complete } = options
  const handle = new MethodHandler<Taro.batchGetStorage.SuccessCallbackResult<T>>({ name: 'batchGetStorage', success, fail, complete })

  const errMsg = getKeyListError(keyList)
  if (errMsg) {
    return handle.fail({ errMsg })
  }

  return handle.success({ dataList: getItems(keyList) })
}

export * from './background-fetch'
export * from './cache-manager'
