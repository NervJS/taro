import { AsyncStorage } from 'react-native'
import { generateUnSupportApi } from '../utils'

export function setStorage (opts = {}) {
  const { key, data, success, fail, complete } = opts
  const res = { errMsg: 'setStorage:ok' }

  return AsyncStorage.setItem(key, JSON.stringify(data))
    .then((e) => {
      success && success(res)
      complete && complete(res)

      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)

      return Promise.reject(err)
    })
}

export function getStorage (opts = {}) {
  const { key, success, fail, complete } = opts
  const res = { errMsg: 'getStorage:ok' }

  return AsyncStorage.getItem(key)
    .then((data) => {
      res.data = JSON.parse(data)
      success && success(res)
      complete && complete(res)

      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)

      return Promise.reject(err)
    })
}

export function getStorageInfo (opts = {}) {
  const { success, fail, complete } = opts
  const res = { errMsg: 'getStorageInfo:ok' }

  return AsyncStorage.getAllKeys()
    .then((data) => {
      res.keys = data
      res.currentSize = null
      res.limitSize = null
      success && success(res)
      complete && complete(res)

      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)

      return Promise.reject(err)
    })
}

export function removeStorage (opts = {}) {
  const { key, success, fail, complete } = opts
  const res = { errMsg: 'removeStorage:ok' }

  return AsyncStorage.removeItem(key)
    .then(() => {
      success && success(res)
      complete && complete(res)

      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)

      return Promise.reject(err)
    })
}

export async function clearStorage () {
  return AsyncStorage.clear()
}

let unSupportApis = ['setStorageSync', 'getStorageSync', 'getStorageInfoSync', 'removeStorageSync', 'clearStorageSync']
unSupportApis = generateUnSupportApi(
  'React Native暂不支持storage的同步存取',
  unSupportApis
)

export default {
  setStorage,
  getStorage,
  getStorageInfo,
  removeStorage,
  clearStorage,
  ...unSupportApis
}
