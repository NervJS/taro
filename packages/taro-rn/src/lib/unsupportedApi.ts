function temporarilyNotSupport(apiName: String, recommended?: String, isSync = true) {
  return () => {
    let errMsg = `RN 端暂不支持 API ${apiName}`
    if (!!recommended) {
      errMsg += `, 请使用 ${recommended}`
    }
    console.error(errMsg)
    if (!isSync) {
      return Promise.reject({
        errMsg
      })
    } else {
      return new Error(errMsg)
    }
  }
}

// 数据缓存
export const setStorageSync = temporarilyNotSupport('setStorageSync', 'setStorage')
export const getStorageSync = temporarilyNotSupport('getStorageSync', 'getStorage')
export const getStorageInfoSync = temporarilyNotSupport('getStorageInfoSync', 'getStorageInfo')
export const removeStorageSync = temporarilyNotSupport('removeStorageSync', 'removeStorage')
export const clearStorageSync = temporarilyNotSupport('clearStorageSync', 'clearStorage')
