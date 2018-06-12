export function getLocation (opts = {}) {
  const geolocation = navigator.geolocation
  if (!geolocation) {
    console.warn('本设备不支持定位功能')
    return
  }
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = opts
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
