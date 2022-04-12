import { getLocation } from '../../src'

describe('location', () => {
  test('should catch unsupported error', () => {
    return getLocation({
      type: 'GCJ-02'
    }).catch(res => {
      expect(res).toEqual({
        errMsg: 'getLocation:fail This coordinate system type is not temporarily supported'
      })
    })
  })

  const mockLocation = {
    /** 位置的精确度 */
    accuracy: 1,
    /** 高度，单位 m */
    altitude: 2,
    /** 水平精度，单位 m */
    horizontalAccuracy: 3,
    /** 纬度，范围为 -90~90，负数表示南纬 */
    latitude: 4,
    /** 经度，范围为 -180~180，负数表示西经 */
    longitude: 5,
    /** 速度，单位 m/s */
    speed: 6,
    /** 垂直精度，单位 m（Android 无法获取，返回 0） */
    verticalAccuracy: 0,
    /** 调用结果,自动补充 */
    errMsg: 'OK'
  }

  test('should get location info object from wx', () => {
    // @ts-ignore
    window.wx = {
      getLocation (options) {
        options.complete(mockLocation)
        options.success(mockLocation)
      }
    }
    return getLocation({
      type: 'WGS84'
    }).then(res => {
      expect(res).toEqual(mockLocation)
    })
  })

  const mockW3CGetLocationResult = {
    /** 位置的精确度 */
    coords: {
      altitude: 1,
      accuracy: 2,
      latitude: 3,
      longitude: 4,
      speed: 5,
      altitudeAccuracy: 6
    }

  }

  test('should get location info object from w3c api', () => {
    // @ts-ignore
    navigator.geolocation = {
      getCurrentPosition (successCallback, errorCallback, optiosns) {
        successCallback(mockW3CGetLocationResult as GeolocationPosition)
      }
    }
    return getLocation({
      type: 'WGS84'
    }).then(res => {
      // console.log(res)
      Object.keys(mockLocation).forEach(
        k => {
          expect(res).toHaveProperty(k)
        }
      )
    })
  })

  test('should return Promise that reject does not support browser feature', () => {
    return getLocation({
      type: 'WGS84'
    }).catch(res => {
      expect(res).toEqual({
        errMsg: 'getLocation:fail The current browser does not support this feature'
      })
    })
  })
})
