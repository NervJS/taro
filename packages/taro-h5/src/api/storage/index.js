import { shouleBeObject, getParameterError } from '../utils'

function setStorage (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setStorage${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { key, data, success, fail, complete } = options
  const res = { errMsg: 'setStorage:ok' }

  if (typeof key !== 'string') {
    res.errMsg = getParameterError({
      name: 'setStorage',
      para: 'key',
      correct: 'String',
      wrong: key
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  setStorageSync(key, data)

  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}

function setStorageSync (key, data = '') {
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

function getStorage (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `getStorage${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { key, success, fail, complete } = options
  const res = { errMsg: 'getStorage:ok' }

  if (typeof key !== 'string') {
    res.errMsg = getParameterError({
      name: 'getStorage',
      para: 'key',
      correct: 'String',
      wrong: key
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  const { result, data } = getItem(key)
  if (result) {
    res.data = data
  } else {
    res.errMsg = 'getStorage:fail data not found'
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}

function getStorageSync (key) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'getStorage',
      correct: 'String',
      wrong: key
    }))
    return
  }

  let res = getItem(key)
  if (res.result) return res.data

  return ''
}

function getItem (key) {
  let item
  try {
    item = JSON.parse(localStorage.getItem(key))
  } catch (e) {}

  // 只返回使用 Taro.setStorage API 存储的数据
  if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
    return { result: true, data: item.data }
  } else {
    return { result: false }
  }
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
  const res = {}
  res.keys = Object.keys(localStorage)
  res.limitSize = null
  res.currentSize = null
  return res
}

function removeStorage (options) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `removeStorage${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { key, success, fail, complete } = options
  const res = { errMsg: 'removeStorage:ok' }

  if (typeof key !== 'string') {
    res.errMsg = getParameterError({
      name: 'removeStorage',
      para: 'key',
      correct: 'String',
      wrong: key
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  removeStorageSync(key)

  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

function removeStorageSync (key) {
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

function clearStorage () {
  localStorage.clear()
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
