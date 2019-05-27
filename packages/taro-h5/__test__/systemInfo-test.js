/* eslint-disable */
import * as Taro from '../src/api'

describe('systemInfo', () => {
  test('should getSystemInfoSync return system information', () => {
    const info = Taro.getSystemInfoSync()
    expect(info).toHaveProperty('brand')
    expect(info).toHaveProperty('model')
    expect(info).toHaveProperty('system')
    expect(info).toHaveProperty('pixelRatio')
    expect(info).toHaveProperty('screenWidth')
    expect(info).toHaveProperty('screenHeight')
    expect(info).toHaveProperty('windowWidth')
    expect(info).toHaveProperty('windowHeight')
    expect(info).toHaveProperty('version')
    expect(info).toHaveProperty('statusBarHeight')
    expect(info).toHaveProperty('platform')
    expect(info).toHaveProperty('language')
    expect(info).toHaveProperty('fontSizeSetting')
    expect(info).toHaveProperty('SDKVersion')
  })

  test('should getSystemInfo return Promise that resolve system information', () => {
    const success = jest.fn()
    const complete = jest.fn()

    expect.assertions(3)
    return Taro.getSystemInfo({
      success,
      complete
    })
      .then(res => {
        expect(success.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
        expect(res).toEqual(Taro.getSystemInfoSync())
      })
  })
})
