import * as Taro from '@tarojs/taro-h5'
const mockConsole = require('jest-mock-console')

describe('location', () => {
  beforeEach(() => {
    mockConsole()
    // @ts-ignore
    navigator.geolocation = {
      getCurrentPosition: jest.fn((callback) => {
        callback({
          coords: {
            accuracy: 2,
            altitude: 1,
            altitudeAccuracy: 6,
            latitude: 3,
            longitude: 4,
            speed: 5
          }
        })
      })
    }
  })

  test('should catch unsupported error', () => {
    expect.assertions(2)
    return Taro.getLocation({
      type: 'GCJ-02'
    })
      .catch(err => {
        const expectErrMsg = 'getLocation:fail This coordinate system type is not temporarily supported'
        expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
        expect(err.errMsg).toMatch(expectErrMsg)
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
    window.wx = {
      getLocation: jest.fn((options) => {
        options.complete?.(mockLocation)
        options.success?.(mockLocation)
      })
    }
    expect.assertions(1)
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
    expect.assertions(8)
    return Taro.getLocation({
      type: 'WGS84'
    })
      .then(res => {
        Object.keys(mockLocation).forEach(k => {
          expect(res).toHaveProperty(k)
        })
      })
  })

  test('should return Promise that reject does not support browser feature', () => {
    // @ts-ignore
    delete navigator.geolocation
    expect.assertions(2)
    return Taro.getLocation({
      type: 'WGS84'
    })
      .catch(err => {
        const expectErrMsg = 'getLocation:fail The current browser does not support this feature'
        expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
        expect(err.errMsg).toMatch(expectErrMsg)
      })
  })
})
