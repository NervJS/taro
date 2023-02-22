/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { setStorage } from '../lib/setStorage'
import { getStorage } from '../lib/getStorage'
import { clearStorage } from '../lib/clearStorage'
import { getStorageInfo } from '../lib/getStorageInfo'
import { removeStorage } from '../lib/removeStorage'

const Taro = {
  setStorage,
  getStorage,
  clearStorage,
  getStorageInfo,
  removeStorage,
}

// NativeModules.RNCAsyncStorage setup mock
describe('storage', () => {
  describe('setStorage', () => {
    test('should set value into storage', async () => {
      await Taro.clearStorage({})
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

      const getData = await AsyncStorage.getItem(key) || ''
      expect(JSON.parse(getData)).toBe(data)
    })

    test('should fail when error occur', async () => {
      await Taro.clearStorage({})
      const data = {}
      const success = jest.fn().mockImplementation(() => {
        throw new Error('setStorage:fail')
      })
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(4)
      // @ts-ignore
      return Taro.setStorage({
        data,
        success,
        fail,
        complete
      }).catch(err => {
        const expectErrMsg = err.errMsg
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
      })
    })
  })

  describe('getStorage', () => {
    test('should get value from storage by key', async () => {
      await Taro.clearStorage({})
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
      await Taro.clearStorage({})
      const key = 'bar'
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      await AsyncStorage.setItem(key, JSON.stringify(data))
      const getData = await AsyncStorage.getItem(key) || ''

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
      // @ts-ignore
      expect(res.data).toBeUndefined()
    })
  })

  describe('getStorageInfo', () => {
    test('获得正确的StorageInfo', async () => {
      await Taro.clearStorage({})
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
      // @ts-ignore
      expect(res.keys).toEqual([key1, key2])
      // @ts-ignore
      expect(res.currentSize).toBe(+(12 / 1024).toFixed(2))
      // @ts-ignore
      expect(res.limitSize).toBe(Infinity)
    })
  })

  describe('clearStorage', () => {
    test('clearStorage能清楚所有的Storage', async () => {
      await Taro.clearStorage({})
      const key1 = 'bar'
      const key2 = 'foo'
      const data = 'data'

      await AsyncStorage.setItem(key1, JSON.stringify(data))
      await AsyncStorage.setItem(key2, JSON.stringify(data))

      const getData1 = await AsyncStorage.getItem(key1) || ''
      const getData2 = await AsyncStorage.getItem(key2) || ''

      expect(JSON.parse(getData1)).toBe(data)
      expect(JSON.parse(getData2)).toBe(data)

      await Taro.clearStorage({})

      const res = await AsyncStorage.getAllKeys()

      expect.assertions(3)

      expect(res).toEqual([])
    })
  })
})
