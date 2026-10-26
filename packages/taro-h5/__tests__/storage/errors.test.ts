import {
  clearStorage,
  clearStorageSync,
  getStorageInfo,
  getStorageInfoSync,
  removeStorage,
  removeStorageSync,
  setStorage,
  setStorageSync
} from '../../src/api/storage'

const operations = [
  ['setStorage', (callbacks = {}) => setStorage({ key: 'test', data: 'value', ...callbacks })],
  ['removeStorage', (callbacks = {}) => removeStorage({ key: 'test', ...callbacks })],
  ['clearStorage', (callbacks = {}) => clearStorage(callbacks)],
  ['getStorageInfo', (callbacks = {}) => getStorageInfo(callbacks)]
] as const

describe('storage browser errors', () => {
  afterEach(() => jest.restoreAllMocks())

  describe.each(operations)('%s', (name, invoke) => {
    test.each(['promise', 'fail', 'complete', 'both'])('handles denied storage access with %s', async mode => {
      const error = new DOMException('Storage access denied', 'SecurityError')
      jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw error })
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const callbacks = {
        success,
        ...(mode === 'fail' || mode === 'both' ? { fail } : {}),
        ...(mode === 'complete' || mode === 'both' ? { complete } : {})
      }
      // Calling the asynchronous API must return a Promise without throwing.
      const result = invoke(callbacks)
      const expected = { errMsg: `${name}:fail Storage access denied` }
      if (mode === 'promise') {
        await expect(result).rejects.toEqual(expected)
      } else {
        // MethodHandler resolves failures when fail or complete is supplied.
        await expect(result).resolves.toEqual(expected)
      }
      expect(success).not.toHaveBeenCalled()
      expect(fail).toHaveBeenCalledTimes(mode === 'fail' || mode === 'both' ? 1 : 0)
      expect(complete).toHaveBeenCalledTimes(mode === 'complete' || mode === 'both' ? 1 : 0)
      if (fail.mock.calls.length) expect(fail).toHaveBeenCalledWith(expected)
      if (complete.mock.calls.length) expect(complete).toHaveBeenCalledWith(expected)
    })
  })

  test('settles quota errors through failure and completion callbacks', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
    })
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    const expected = { errMsg: 'setStorage:fail Storage quota exceeded' }
    await expect(setStorage({ key: 'test', data: 'value', success, fail, complete })).resolves.toEqual(expected)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(expected)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(expected)
  })

  test('rejects serialization errors without writing data', async () => {
    const data: Record<string, unknown> = {}
    data.self = data
    const write = jest.spyOn(Storage.prototype, 'setItem')
    await expect(setStorage({ key: 'test', data })).rejects.toEqual({
      errMsg: expect.stringMatching(/^setStorage:fail .*circular/i)
    })
    expect(write).not.toHaveBeenCalled()
    expect(() => setStorageSync('test', data)).toThrow(TypeError)
  })

  test.each([
    ['setStorageSync', () => setStorageSync('test', 'value')],
    ['removeStorageSync', () => removeStorageSync('test')],
    ['clearStorageSync', () => clearStorageSync()],
    ['getStorageInfoSync', () => getStorageInfoSync()]
  ] as const)('%s still throws browser errors synchronously', (_name, invoke) => {
    const error = new DOMException('Storage access denied', 'SecurityError')
    jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw error })
    expect(invoke).toThrow(error)
  })

  test('does not turn success callback exceptions into storage failures', () => {
    const error = new Error('User callback failed')
    const fail = jest.fn()
    expect(() => setStorage({ key: 'test', data: 'value', success: () => { throw error }, fail })).toThrow(error)
    expect(fail).not.toHaveBeenCalled()
    localStorage.removeItem('test')
  })
})
