import * as Taro from '@tarojs/taro-h5'

const mockConsole = require('jest-mock-console')

describe('batch storage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockConsole()
  })

  afterEach(() => jest.restoreAllMocks())

  describe('batchSetStorageSync', () => {
    test('should save every item to localStorage', () => {
      const data = { env: 'h5', mixArr: [1, { bar: '_bar' }, 'test'] }

      Taro.batchSetStorageSync([
        { key: 'foo', value: 'bar' },
        { key: 'obj', value: data },
        { key: 'empty', value: undefined }
      ])

      expect(localStorage.foo).toBe(JSON.stringify({ data: 'bar' }))
      expect(localStorage.obj).toBe(JSON.stringify({ data }))
      expect(localStorage.empty).toBe(JSON.stringify({ data: '' }))
      expect(Taro.getStorageSync('obj')).toEqual(data)
    })

    test('should overwrite existing values', () => {
      Taro.setStorageSync('foo', 'old')

      Taro.batchSetStorageSync([{ key: 'foo', value: 'new' }])

      expect(Taro.getStorageSync('foo')).toBe('new')
    })

    test('kvList should be an array', () => {
      Taro.batchSetStorageSync()

      expect(console.error).toHaveBeenCalledWith('batchSetStorageSync:fail parameter error: parameter.kvList should be Array instead of Undefined')
    })

    test('every key should be a string and nothing is written otherwise', () => {
      Taro.batchSetStorageSync([{ key: 'foo', value: 'bar' }, { value: 'baz' }])

      expect(console.error).toHaveBeenCalledWith('batchSetStorageSync:fail parameter error: parameter.kvList[1].key should be String instead of Undefined')
      expect(localStorage.length).toBe(0)
    })

    test('should not write any item when a value cannot be serialized', () => {
      const data: Record<string, unknown> = {}
      data.self = data

      expect(() => Taro.batchSetStorageSync([
        { key: 'foo', value: 'bar' },
        { key: 'circular', value: data }
      ])).toThrow(TypeError)
      expect(localStorage.length).toBe(0)
    })

    test('should restore earlier items when a write fails part way', () => {
      Taro.setStorageSync('foo', 'old')
      const setItem = Storage.prototype.setItem
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
        if (key === 'big') throw new DOMException('quota exceeded', 'QuotaExceededError')
        return setItem.call(this, key, value)
      })

      expect(() => Taro.batchSetStorageSync([
        { key: 'foo', value: 'new' },
        { key: 'bar', value: 'baz' },
        { key: 'big', value: 'x' }
      ])).toThrow('quota exceeded')
      expect(Taro.getStorageSync('foo')).toBe('old')
      expect(localStorage.getItem('bar')).toBeNull()
      expect(localStorage.getItem('big')).toBeNull()
    })

    test('should free the space used by the batch before restoring old values', () => {
      const limit = 120
      const used = (skip?: string) => Object.keys(localStorage).reduce((n, k) => k === skip ? n : n + (localStorage.getItem(k) as string).length, 0)
      Taro.setStorageSync('foo', 'o'.repeat(80))
      const setItem = Storage.prototype.setItem
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
        if (used(key) + value.length > limit) throw new DOMException('quota exceeded', 'QuotaExceededError')
        return setItem.call(this, key, value)
      })

      expect(() => Taro.batchSetStorageSync([
        { key: 'foo', value: 'n' },
        { key: 'bar', value: 'b'.repeat(80) },
        { key: 'big', value: 'x'.repeat(200) }
      ])).toThrow('quota exceeded')
      expect(Taro.getStorageSync('foo')).toBe('o'.repeat(80))
      expect(localStorage.getItem('bar')).toBeNull()
      expect(localStorage.getItem('big')).toBeNull()
    })

    test('should leave keys untouched when the first write fails', () => {
      Taro.setStorageSync('foo', 'old')
      const setItem = Storage.prototype.setItem
      const removeItem = jest.spyOn(Storage.prototype, 'removeItem')
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
        if (key === 'big') throw new DOMException('quota exceeded', 'QuotaExceededError')
        return setItem.call(this, key, value)
      })

      expect(() => Taro.batchSetStorageSync([
        { key: 'big', value: 'x' },
        { key: 'foo', value: 'new' }
      ])).toThrow('quota exceeded')
      expect(removeItem).not.toHaveBeenCalled()
      expect(Taro.getStorageSync('foo')).toBe('old')
    })
  })

  describe('batchSetStorage', () => {
    test('options should be object', () => {
      expect.assertions(2)
      return Taro.batchSetStorage()
        .catch(err => {
          const expectErrMsg = 'batchSetStorage:fail parameter error: parameter should be Object instead of Undefined'
          expect(console.error).toHaveBeenCalledWith(expectErrMsg)
          expect(err.errMsg).toBe(expectErrMsg)
        })
    })

    test('options.kvList should be an array', async () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const expected = { errMsg: 'batchSetStorage:fail parameter error: parameter.kvList should be Array instead of String' }

      await expect(Taro.batchSetStorage({ kvList: 'foo', success, fail, complete })).resolves.toEqual(expected)
      expect(success).not.toHaveBeenCalled()
      expect(fail).toHaveBeenCalledWith(expected)
      expect(complete).toHaveBeenCalledWith(expected)
    })

    test('every key should be a string', async () => {
      await expect(Taro.batchSetStorage({ kvList: [{ key: 'foo', value: 1 }, null] })).rejects.toEqual({
        errMsg: 'batchSetStorage:fail parameter error: parameter.kvList[1].key should be String instead of Undefined'
      })
      expect(localStorage.length).toBe(0)
    })

    test('should save every item to localStorage', async () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const expected = { errMsg: 'batchSetStorage:ok' }

      await expect(Taro.batchSetStorage({
        kvList: [{ key: 'foo', value: 'bar' }, { key: 'num', value: 1 }],
        success,
        fail,
        complete
      })).resolves.toEqual(expected)
      expect(success).toHaveBeenCalledWith(expected)
      expect(fail).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalledWith(expected)
      expect(Taro.getStorageSync('foo')).toBe('bar')
      expect(Taro.getStorageSync('num')).toBe(1)
    })

    test('should fail without writing any item when a value cannot be serialized', async () => {
      const data: Record<string, unknown> = {}
      data.self = data

      await expect(Taro.batchSetStorage({
        kvList: [{ key: 'foo', value: 'bar' }, { key: 'circular', value: data }]
      })).rejects.toEqual({
        errMsg: expect.stringMatching(/^batchSetStorage:fail .*circular/i)
      })
      expect(localStorage.length).toBe(0)
    })

    test('should fail when the browser rejects the write', async () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
      })
      const fail = jest.fn()
      const expected = { errMsg: 'batchSetStorage:fail Storage quota exceeded' }

      await expect(Taro.batchSetStorage({ kvList: [{ key: 'foo', value: 'bar' }], fail })).resolves.toEqual(expected)
      expect(fail).toHaveBeenCalledWith(expected)
    })
  })

  describe('batchGetStorageSync', () => {
    test('should return values in the order of keyList', () => {
      const data = { env: 'h5' }
      Taro.setStorageSync('foo', 'bar')
      Taro.setStorageSync('obj', data)
      Taro.setStorageSync('zero', 0)
      localStorage.setItem('raw', 'not set by Taro')

      expect(Taro.batchGetStorageSync(['obj', 'missing', 'foo', 'raw', 'zero'])).toEqual([data, '', 'bar', '', 0])
      expect(Taro.batchGetStorageSync([])).toEqual([])
    })

    test('should return an empty string for JSON that overrides hasOwnProperty', () => {
      localStorage.setItem('raw', '{"hasOwnProperty":null}')

      expect(Taro.batchGetStorageSync(['raw'])).toEqual([''])
    })

    test('keyList should be an array of strings', () => {
      expect(Taro.batchGetStorageSync()).toEqual([])
      expect(console.error).toHaveBeenNthCalledWith(1, 'batchGetStorageSync:fail parameter error: parameter.keyList should be Array instead of Undefined')

      expect(Taro.batchGetStorageSync(['foo', 1])).toEqual([])
      expect(console.error).toHaveBeenNthCalledWith(2, 'batchGetStorageSync:fail parameter error: parameter.keyList[1] should be String instead of Number')
    })
  })

  describe('batchGetStorage', () => {
    test('options should be object', () => {
      expect.assertions(2)
      return Taro.batchGetStorage(null)
        .catch(err => {
          const expectErrMsg = 'batchGetStorage:fail parameter error: parameter should be Object instead of Null'
          expect(console.error).toHaveBeenCalledWith(expectErrMsg)
          expect(err.errMsg).toBe(expectErrMsg)
        })
    })

    test('options.keyList should be an array of strings', async () => {
      await expect(Taro.batchGetStorage({})).rejects.toEqual({
        errMsg: 'batchGetStorage:fail parameter error: parameter.keyList should be Array instead of Undefined'
      })
      await expect(Taro.batchGetStorage({ keyList: [null] })).rejects.toEqual({
        errMsg: 'batchGetStorage:fail parameter error: parameter.keyList[0] should be String instead of Null'
      })
    })

    test('should return dataList in the order of keyList', async () => {
      Taro.batchSetStorageSync([{ key: 'foo', value: 'bar' }, { key: 'arr', value: [1, 2] }])
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const expected = { errMsg: 'batchGetStorage:ok', dataList: [[1, 2], '', 'bar'] }

      await expect(Taro.batchGetStorage({ keyList: ['arr', 'missing', 'foo'], success, fail, complete })).resolves.toEqual(expected)
      expect(success).toHaveBeenCalledWith(expected)
      expect(fail).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalledWith(expected)
    })
  })
})
