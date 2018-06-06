import { AsyncStorage } from 'react-native'

// function throwErr (api, key) {
//   const e = new Error(`${api}:fail parameter error: parameter should be String instead of ${typeof key}`)
//   return e
// }

function setStorage (opts = {}) {
  const { key, data, success, fail, complete } = opts
  const res = { errMsg: 'setStorage:ok' }

  // if (typeof key !== 'string') {
  //   const e = throwErr('setStorage', key)
  //   res.errMsg = e.message
  //   fail && fail(res)
  //   complete && complete(res)
  //   return Promise.reject(e)
  // }

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

export {
  setStorage,
  setStorageSync,
  getStorage,
  getStorageSync
}
