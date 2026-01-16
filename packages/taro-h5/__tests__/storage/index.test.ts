import * as Taro from '@tarojs/taro-h5'

const mockConsole = require('jest-mock-console')

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockConsole()
  })

  describe('setStorage', () => {
    test('options should be object', () => {
      expect.assertions(4)
      return Promise.all([
        Taro.setStorage()
          .catch(err => {
            const expectErrMsg = 'setStorage:fail parameter error: parameter should be Object instead of Undefined'
            expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          }),
        Taro.setStorage(null)
          .catch(err => {
            const expectErrMsg = 'setStorage:fail parameter error: parameter should be Object instead of Null'
            expect(console.error).toHaveBeenNthCalledWith(2, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          })
      ])
    })

    test('options.key should be string', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(5)
      return Taro.setStorage({
        success,
        fail,
        complete
      })
        .then(() => {
          const expectErrMsg = 'setStorage:fail parameter error: parameter.key should be String instead of Undefined'
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
        })
    })

    test('should save to localStorage', () => {
      const key = 'foo'
      const data = 'bar'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(7)
      return Taro.setStorage({
        key,
        data,
        success,
        fail,
        complete
      })
        .then(res => {
          const expectMsg = 'setStorage:ok'
          const expectData = JSON.stringify({ data })
          expect(success.mock.calls.length).toBe(1)
          expect(success.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
          expect(fail.mock.calls.length).toBe(0)
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
          expect(res.errMsg).toMatch(expectMsg)
          expect(localStorage[key]).toBe(expectData)
        })
    })
  })

  describe('setStorageSync', () => {
    test('key should be a string', () => {
      Taro.setStorageSync()

      const expectErrMsg = 'setStorage:fail parameter error: parameter should be String instead of Undefined'
      expect(console.error).toHaveBeenCalledWith(expectErrMsg)
    })

    test('should data default to a empty string', () => {
      const key = 'foo'

      Taro.setStorageSync(key)

      const expectData = JSON.stringify({ data: '' })
      expect(localStorage[key]).toBe(expectData)
    })

    test('should save to localStorage', () => {
      const key = 'foo'
      const data = {
        env: 'h5',
        mixArr: [1, { bar: '_bar' }, 'test'],
        obj: {
          xyz: '_xyz'
        }
      }

      Taro.setStorageSync(key, data)

      const expectData = JSON.stringify({ data })
      expect(localStorage[key]).toBe(expectData)
    })
  })

  describe('getStorage', () => {
    test('options should be object', () => {
      expect.assertions(4)
      return Promise.all([
        Taro.getStorage()
          .catch(err => {
            const expectErrMsg = 'getStorage:fail parameter error: parameter should be Object instead of Undefined'
            expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          }),
        Taro.getStorage(null)
          .catch(err => {
            const expectErrMsg = 'getStorage:fail parameter error: parameter should be Object instead of Null'
            expect(console.error).toHaveBeenNthCalledWith(2, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          })
      ])
    })

    test('options.key should be string', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(5)
      return Taro.getStorage({
        success,
        fail,
        complete
      })
        .then(() => {
          const expectErrMsg = 'getStorage:fail parameter error: parameter.key should be String instead of Undefined'
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
        })
    })

    test('should not contain data when no found in storage', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(5)
      return Taro.getStorage({
        key: 'test',
        success,
        fail,
        complete
      })
        .then(() => {
          const expectObj = { errMsg: 'getStorage:fail data not found' }
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectObj.errMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectObj.errMsg })
        })
    })

    test('should not contain data when data is not stored by Taro Storage Api', () => {
      localStorage.setItem('test', 'xxx')
      expect.assertions(1)
      return Taro.getStorage({ key: 'test' })
        .catch(err => {
          expect(err).toEqual({ errMsg: 'getStorage:fail data not found' })
        })
    })

    test('should get from localStorage', () => {
      const key = 'foo'
      const data = 'bar'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      Taro.setStorageSync(key, data)

      expect.assertions(6)
      return Taro.getStorage({
        key,
        success,
        fail,
        complete
      })
        .then(res => {
          const expectObj = { errMsg: 'getStorage:ok', data }
          expect(success.mock.calls.length).toBe(1)
          expect(success.mock.calls[0][0]).toEqual(expectObj)
          expect(fail.mock.calls.length).toBe(0)
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual(expectObj)
          expect(res).toEqual(expectObj)
        })
    })
  })

  describe('getStorageSync', () => {
    test('key should be a string', () => {
      const res = Taro.getStorageSync(1)

      const expectErrMsg = 'getStorageSync:fail parameter error: parameter should be String instead of Number'
      expect(console.error).toHaveBeenCalledWith(expectErrMsg)
      expect(res).toBe(undefined)
    })

    test('should return a number', () => {
      const key = 'test'
      const data = 100
      Taro.setStorageSync(key, data)
      expect(Taro.getStorageSync(key)).toBe(data)
    })

    test('should return a string', () => {
      const key = 'test'
      const data = 'xyz'
      Taro.setStorageSync(key, data)
      expect(Taro.getStorageSync(key)).toBe(data)
    })

    test('should return a boolean', () => {
      const key = 'test'
      const data = true
      Taro.setStorageSync(key, data)
      expect(Taro.getStorageSync(key)).toBe(data)
    })

    test('should return a null', () => {
      const key = 'test'
      const data = null
      Taro.setStorageSync(key, data)
      expect(Taro.getStorageSync(key)).toBe(data)
    })

    test('should return a string when stored data is undefined', () => {
      const key = 'test'
      Taro.setStorageSync(key)
      expect(Taro.getStorageSync(key)).toBe('')
    })

    test('should return a object', () => {
      const key = 'test'
      const data = {
        env: 'h5',
        mixArr: [1, { bar: '_bar' }, 'test'],
        obj: {
          xyz: '_xyz'
        }
      }
      Taro.setStorageSync(key, data)
      expect(Taro.getStorageSync(key)).toEqual(data)
    })

    test('should return a empty string', () => {
      const key = 'test'
      const data = Symbol('data')
      Taro.setStorageSync(key, data)
      expect(Taro.getStorageSync(key)).toBe('')
    })

    test('should not contain data when no found in storage', () => {
      expect(Taro.getStorageSync('test')).toBe('')
    })

    test('should not contain data when data is not stored by Taro Storage Api', () => {
      localStorage.setItem('test', 'xxx')
      expect(Taro.getStorageSync('test')).toBe('')
    })
  })

  describe('getStorageInfo', () => {
    test('should resolve storage info', () => {
      const success = jest.fn()
      const complete = jest.fn()

      Taro.setStorageSync('foo', 1)
      Taro.setStorageSync('bar', 2)

      expect.assertions(8)
      return Taro.getStorageInfo({ success, complete })
        .then((res: any) => {
          const { keys, limitSize, currentSize, errMsg } = res
          expect(keys).toEqual(['foo', 'bar'])
          expect(limitSize).toBeNaN()
          expect(currentSize).toBeNaN()
          expect(errMsg).toMatch('getStorageInfo:ok')
          expect(success.mock.calls.length).toBe(1)
          expect(success.mock.calls[0][0]).toEqual(res)
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual(res)
        })
    })
  })

  describe('getStorageInfoSync', () => {
    test('should return storage info', () => {
      Taro.setStorageSync('foo', 1)
      Taro.setStorageSync('bar', 2)

      const res = Taro.getStorageInfoSync()
      const { keys, limitSize, currentSize } = res
      expect(keys).toEqual(['foo', 'bar'])
      expect(limitSize).toBeNaN()
      expect(currentSize).toBeNaN()
    })
  })

  describe('removeStorage', () => {
    test('options should be object', () => {
      expect.assertions(4)
      return Promise.all([
        Taro.removeStorage()
          .catch(err => {
            const expectErrMsg = 'removeStorage:fail parameter error: parameter should be Object instead of Undefined'
            expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          }),
        Taro.removeStorage(null)
          .catch(err => {
            const expectErrMsg = 'removeStorage:fail parameter error: parameter should be Object instead of Null'
            expect(console.error).toHaveBeenNthCalledWith(2, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          })
      ])
    })

    test('options.key should be string', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(5)
      return Taro.removeStorage({
        success,
        fail,
        complete
      })
        .then(() => {
          const expectErrMsg = 'removeStorage:fail parameter error: parameter.key should be String instead of Undefined'
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
        })
    })

    test('should remove storage successfully', () => {
      const key = 'foo'
      const data = 'bar'
      const success = jest.fn()
      const complete = jest.fn()

      localStorage.setItem(key, data)

      expect.assertions(6)
      return Taro.removeStorage({
        key,
        success,
        complete
      })
        .then(res => {
          const expectObj = { errMsg: 'removeStorage:ok' }
          // expect(localStorage.removeItem).toHaveBeenLastCalledWith(key)
          expect(localStorage[key]).toBeUndefined()
          expect(success.mock.calls.length).toBe(1)
          expect(success.mock.calls[0][0]).toEqual(expectObj)
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual(expectObj)
          expect(res).toEqual(expectObj)
        })
    })
  })

  describe('removeStorageSync', () => {
    test('key should be a string', () => {
      Taro.removeStorageSync()

      const expectErrMsg = 'removeStorage:fail parameter error: parameter should be String instead of Undefined'
      expect(console.error).toHaveBeenCalledWith(expectErrMsg)
    })

    test('should remove storage successfully', () => {
      const key = 'foo'
      const data = 'bar'

      localStorage.setItem(key, data)
      Taro.removeStorageSync(key)
      // expect(localStorage.removeItem).toHaveBeenLastCalledWith(key)
      expect(localStorage[key]).toBeUndefined()
    })
  })

  describe('clearStorage', () => {
    test('', () => {
      Taro.setStorageSync('foo', 1)
      Taro.setStorageSync('bar', 2)

      Taro.clearStorage()
      // expect(localStorage.clear).toHaveBeenCalled()
      expect(Object.keys(localStorage).length).toBe(0)
    })
  })
})
