import MockStorage from './__mock__/mockAsyncStorage'
import Taro from '../index.js'

const storageCache = {}
const AsyncStorage = new MockStorage(storageCache)
jest.setMock('AsyncStorage', AsyncStorage)

Taro.initNativeApi(Taro)

describe('storage', () => {
  describe('setStorage', () => {
    test('should set value into storage', async () => {
      const key = 'bar'
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      const res = await Taro.setStorage({
        key,
        data,
        success,
        fail,
        complete
      })
      const expectMsg = 'setStorage:ok'
      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
      expect(res.errMsg).toMatch(expectMsg)

      const getData = await AsyncStorage.getItem(key)
      expect(JSON.parse(getData)).toBe(data)
    })

    test('should fail when error occur', () => {
      const data = {}
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      return Taro.setStorage({
        data,
        success,
        fail,
        complete
      }).catch(err => {
        const expectErrMsg = err.message
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
      })
    })
  })

  describe('getStorage', () => {
    test('should get value from storage by key', async () => {
      const key = 'bar'
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      await AsyncStorage.setItem(key, JSON.stringify(data))
      const res = await Taro.getStorage({
        key,
        success,
        fail,
        complete
      })
      const expectMsg = 'getStorage:ok'
      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual(res)
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual(res)
      expect(res.errMsg).toMatch(expectMsg)
      expect(res.data).toBe(data)
    })
  })
})
