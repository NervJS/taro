import * as Taro from '@tarojs/taro-h5'

describe('location', () => {
  test('should catch unsupported error', () => {
    return Taro.getLocation({
      type: 'GCJ-02'
    })
      .catch(err => {
        expect(err).toEqual({
          errMsg: 'getLocation:fail This coordinate system type is not temporarily supported'
        })
      })
  })

  const mockLocation = {
    accuracy: 1,
    altitude: 2,
    horizontalAccuracy: 3,
    latitude: 4,
    longitude: 5,
    speed: 6,
    verticalAccuracy: 0,
    errMsg: 'getLocation:ok'
  }

  test('should get location info object from wx', () => {
    // @ts-ignore
    Object.defineProperty(window, 'wx', {
      value: {
        getLocation: (options) => {
          options.complete(mockLocation)
          options.success(mockLocation)
        }
      }
    })
    return Taro.getLocation({
      type: 'WGS84'
    })
      .then(res => {
        expect(res).toEqual(mockLocation)
      })
      .finally(() => {
        // @ts-ignore
        delete window.wx
      })
  })

  test('should get location info object from w3c api', () => {
    // @ts-ignore
    navigator.geolocation = {
      getCurrentPosition (callback) {
        callback({
          coords: {
            altitude: 1,
            accuracy: 2,
            latitude: 3,
            longitude: 4,
            speed: 5,
            altitudeAccuracy: 6
          }
        })
      }
    }
    return Taro.getLocation({
      type: 'WGS84'
    })
      .then(res => {
        Object.keys(mockLocation).forEach(k => {
          expect(res).toHaveProperty(k)
        })
      })
      .finally(() => {
        // @ts-ignore
        navigator.geolocation = null
      })
  })

  test('should return Promise that reject does not support browser feature', () => {
    return Taro.getLocation({
      type: 'WGS84'
    })
      .catch(err => {
        expect(err).toEqual({
          errMsg: 'getLocation:fail The current browser does not support this feature'
        })
      })
  })
})
