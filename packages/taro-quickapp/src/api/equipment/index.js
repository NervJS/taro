import barcode from '@system.barcode'

export function scanCode (options = {}) {
  const {
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'scanCode:ok' }

  return new Promise((resolve, reject) => {
    barcode.scan({
      success (data) {
        res.result = data.result
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      cancel () {
        res.errMsg = 'cancelScanCode: success'
        success && success(res)
        complete && complete(res)
        res.result = ''
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        complete && complete(res)
        fail && fail(res)
        reject(res)
        console.log(`scanCode fail, code = ${code}`, data)
      }
    })
  })
}

export default {
  scanCode
}
