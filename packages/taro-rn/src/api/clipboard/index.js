import { Clipboard } from 'react-native'

export function setClipboardData (opts = {}) {
  const { data, success, fail, complete } = opts
  const res = { errMsg: 'setClipboardData:ok' }

  if (typeof data !== 'string') {
    res.errMsg = 'setClipboardData:fail parameter error: parameter.data should be String'
    fail && fail(res)
    complete && complete(res)

    return Promise.reject(res)
  }

  Clipboard.setString(data)
  res.data = data
  success && success(res)
  complete && complete(res)

  return Promise.resolve(res)
}

export function getClipboardData (opts = {}) {
  const { success, fail, complete } = opts
  const res = { errMsg: 'getClipboardData:ok' }

  return Clipboard.getString()
    .then((content) => {
      res.data = content
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

export default {
  setClipboardData,
  getClipboardData
}
