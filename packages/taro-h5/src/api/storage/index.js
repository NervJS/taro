import { getEnv, ENV_TYPE } from '../../util'
const env = getEnv()

function setStorage (options = {}) {
  const { key, data, success, fail, complete } = options
  const res = { errMsg: 'getStorage:ok' }

  if (typeof key !== 'string') {
    const e = new Error(`setStorage:fail parameter error: parameter should be String instead of ${typeof key}`)
    res.errMsg = e.message
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(e)
  }

  setStorageSync(key, data)

  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

function setStorageSync (key, data = '') {
  if (typeof key !== 'string') throw new Error(`setStorageSync:fail parameter error: parameter should be String instead of ${typeof key}`)

  const type = typeof data
  let obj = {}

  if (type === 'symbol') {
    obj = { data: '' }
  } else {
    obj = { data }
  }
  if (env === ENV_TYPE.WEAPP) {
    wx.setStorageSync(key, obj)
  } else {
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

function getStorage (options = {}) {
  const { key, success, fail, complete } = options
  const res = { errMsg: 'getStorage:ok' }

  if (typeof key !== 'string') {
    const e = new Error(`getStorage:fail parameter error: parameter should be String instead of ${typeof key}`)
    res.errMsg = e.message
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(e)
  }

  res.data = getStorageSync(key)

  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

function getStorageSync (key) {
  if (typeof key !== 'string') throw new Error(`getStorageSync:fail parameter error: parameter should be String instead of ${typeof key}`)
  let res
  if (env === ENV_TYPE.WEAPP) {
    res = wx.getStorageSync(key)
  } else {
    res = JSON.parse(localStorage.getItem(key))
  }

  // 只返回使用 Taro.setStorage API 存储的数据
  if (res && res.data) return res.data

  return ''
}

function getStorageInfo (options = {}) {
  const { success, complete } = options
  const res = { errMsg: 'getStorageInfo:ok' }

  const info = getStorageInfoSync()

  Object.assign(res, info)

  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

function getStorageInfoSync () {
  if (env === ENV_TYPE.WEAPP) {
    return wx.getStorageInfoSync()
  }
  const res = {}
  res.keys = Object.keys(localStorage)
  res.limitSize = null
  res.currentSize = null
  return res
}

function removeStorage (options = {}) {
  const { key, success, fail, complete } = options
  const res = { errMsg: 'removeStorage:ok' }

  if (typeof key !== 'string') {
    const e = new Error(`removeStorage:fail parameter error: parameter should be String instead of ${typeof key}`)
    res.errMsg = e.message
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(e)
  }

  removeStorageSync(key)

  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

function removeStorageSync (key) {
  if (typeof key !== 'string') throw new Error(`removeStorageSync:fail parameter error: parameter should be String instead of ${typeof key}`)
  if (env === ENV_TYPE.WEAPP) {
    wx.removeStorageSync(key)
  } else {
    localStorage.removeItem(key)
  }
}

function clearStorage () {
  if (env === ENV_TYPE.WEAPP) {
    wx.clearStorage()
  } else {
    localStorage.clear()
  }
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
