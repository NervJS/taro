import share from '@system.share'

export function showShareMenu (opts = {}) {
  const { type, data, success, fail, complete } = opts
  const res = { errMsg: 'showShareMenu:ok' }

  return new Promise((resolve, reject) => {
    share.share({
      type,
      data,
      success () {
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      fail (message, code) {
        res.errMsg = message
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export default {
  showShareMenu
}
