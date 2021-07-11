export function generateUnSupportApi (errText, fnNames) {
  const res = {}
  fnNames.forEach((fnName) => {
    res[fnName] = function () {
      throw new Error(errText)
    }
  })
  return res
}

export function makeSyncPromise (fnName, process, options = {}) {
  const {
    success,
    fail,
    complete
  } = options

  const res = { errMsg: `${fnName}:ok` }

  return new Promise((resolve, reject) => {
    try {
      process && process()
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = `${fnName}:error`
      res.data = data
      fail && fail(res)
      complete && complete(res)
      reject(res)
    }
  })
}

export function temporarilyNotSupport (apiName) {
  return () => {
    const errMsg = `暂时不支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject(new Error(errMsg))
  }
}
