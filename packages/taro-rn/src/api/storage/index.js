import { AsyncStorage } from 'react-native'

function setStorage (opts = {}) {
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

async function setStorageSync (key, data = '') {
  await AsyncStorage.setItem(key, JSON.stringify(data)).catch((err) => {
    return Promise.reject(err)
  })
}

function getStorage (opts = {}) {
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

async function getStorageSync (key) {
  const res = await AsyncStorage.getItem(key).catch((err) => {
    return Promise.reject(err)
  })
  return JSON.parse(res)
}

function getStorageInfo (opts = {}) {
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

async function getStorageInfoSync () {
  const res = {}
  res.keys = await AsyncStorage.getAllKeys().catch((err) => {
    return Promise.reject(err)
  })
  res.currentSize = null
  res.limitSize = null
  return res
}

function removeStorage (opts = {}) {
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

async function removeStorageSync (key) {
  const res = await AsyncStorage.removeItem(key).catch((err) => {
    return Promise.reject(err)
  })
  return JSON.parse(res)
}

async function clearStorage () {
  const res = await getStorageInfoSync()
  const keys = res.keys
  return AsyncStorage.multiRemove(keys)
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
  clearStorage as clearStorageSync
}
