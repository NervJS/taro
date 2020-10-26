import { AsyncStorage } from 'react-native'
import MockStorage from './__mock__/mockAsyncStorage'
import storage from '../api/storage'

const Taro = Object.assign({}, storage)

describe('storage', () => {
  beforeEach(() => {
    const storageCache = {}
    const AsyncStorage = new MockStorage(storageCache)
    jest.setMock('AsyncStorage', AsyncStorage)
  })

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

      expect.assertions(7)

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

      expect.assertions(5)

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

      expect.assertions(7)

      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual(res)
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual(res)
      expect(res.errMsg).toMatch(expectMsg)
      expect(res.data).toBe(data)
    })
  })

  describe('removeStorage', () => {
    test('能根据key删除Storage里的值', async () => {
      const key = 'bar'
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      await AsyncStorage.setItem(key, JSON.stringify(data))
      const getData = await AsyncStorage.getItem(key)

      expect(JSON.parse(getData)).toBe(data)

      const res = await Taro.removeStorage({
        key,
        success,
        fail,
        complete
      })
      const expectMsg = 'removeStorage:ok'

      expect.assertions(8)

      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual(res)
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual(res)
      expect(res.errMsg).toMatch(expectMsg)
      expect(res.data).toBeUndefined()
    })
  })

  describe('getStorageInfo', () => {
    test('获得正确的StorageInfo', async () => {
      const key1 = 'bar'
      const key2 = 'foo'
      const data = 'data'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      await AsyncStorage.setItem(key1, JSON.stringify(data))
      await AsyncStorage.setItem(key2, JSON.stringify(data))

      const res = await Taro.getStorageInfo({
        success,
        fail,
        complete
      })
      const expectMsg = 'getStorageInfo:ok'

      expect.assertions(9)

      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual(res)
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual(res)
      expect(res.errMsg).toMatch(expectMsg)
      expect(res.keys).toEqual([key1, key2])
      expect(res.currentSize).toBeNull()
      expect(res.limitSize).toBeNull()
    })
  })

  describe('clearStorage', () => {
    test('clearStorage能清楚所有的Storage', async () => {
      const key1 = 'bar'
      const key2 = 'foo'
      const data = 'data'

      await AsyncStorage.setItem(key1, JSON.stringify(data))
      await AsyncStorage.setItem(key2, JSON.stringify(data))

      const getData1 = await AsyncStorage.getItem(key1)
      const getData2 = await AsyncStorage.getItem(key2)

      expect(JSON.parse(getData1)).toBe(data)
      expect(JSON.parse(getData2)).toBe(data)

      await Taro.clearStorage()

      const res = await AsyncStorage.getAllKeys()

      expect.assertions(3)

      expect(res).toEqual([])
    })
  })
})
