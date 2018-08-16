export function getLocation (opts = {}) {
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = opts
    const geolocation = navigator.geolocation
    if (!geolocation) {
      const res = {}
      res.errMsg = '本设备不支持定位功能'
      console.warn(res.errMsg)
      fail && fail(res)
      complete && complete(res)
      reject(res)
      return
    }
    geolocation.getCurrentPosition((res) => {
      const coords = res.coords
      coords.timestamp = res.timestamp
      coords.verticalAccuracy = 0
      coords.horizontalAccuracy = 0

      success && success(coords)
      complete && complete(coords)
      resolve(coords)
    }, (err) => {
      const res = {}
      res.errMsg = err.message

      fail && fail(res)
      complete && complete(res)
      reject(res)
    })
  })
}

export default {
  getLocation
}
