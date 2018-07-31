const geolocation = {
  getCurrentPosition (callback, errFn) {
    const res = {}
    const coords = {
      latitude: 0,
      longitude: 0,
      speed: 0,
      accuracy: 0,
      altitude: 0
    }
    res.coords = coords
    res.timestamp = Date.now()
    callback && callback(res)
  }
}

const navigator = {}
navigator.geolocation = geolocation

export default navigator
