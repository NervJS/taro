import { getSystemInfo } from '../lib/getSystemInfo'
import { getSystemInfoSync } from '../lib/getSystemInfoSync'

const Taro = { getSystemInfo, getSystemInfoSync }

describe('system', () => {
  describe('getSystemInfoSync', () => {
    test('能同步返回正确的系统信息', () => {
      const expectRes = {
        brand: null,
        model: null,
        pixelRatio: expect.any(Number),
        screenWidth: expect.any(Number),
        screenHeight: expect.any(Number),
        windowWidth: expect.any(Number),
        windowHeight: expect.any(Number),
        statusBarHeight: expect.any(Number),
        language: null,
        version: null,
        system: undefined,
        platform: expect.any(String),
        fontSizeSetting: expect.any(Number),
        SDKVersion: null
      }

      const res = Taro.getSystemInfoSync()
      expect(res).toEqual(expect.objectContaining(expectRes))
    })
  })

  describe('getSystemInfo', () => {
    test('能异步返回正确的系统信息', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const expectRes = {
        brand: null,
        model: null,
        pixelRatio: expect.any(Number),
        screenWidth: expect.any(Number),
        screenHeight: expect.any(Number),
        windowWidth: expect.any(Number),
        windowHeight: expect.any(Number),
        statusBarHeight: expect.any(Number),
        language: null,
        version: null,
        system: undefined,
        platform: expect.any(String),
        fontSizeSetting: expect.any(Number),
        SDKVersion: null
      }

      expect.assertions(4)

      return Taro.getSystemInfo({
        success,
        fail,
        complete
      }).then((res) => {
        expect(success.mock.calls.length).toBe(1)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(res).toEqual(expect.objectContaining(expectRes))
      })
    })
  })
})
