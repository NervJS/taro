import { getRandomValues } from '../../src/api/device/crypto'

describe('getRandomValues', () => {
  test('returns an ArrayBuffer filled with random bytes of the given length', async () => {
    const spy = jest.spyOn(window.crypto, 'getRandomValues')
    const success = jest.fn()
    const complete = jest.fn()

    const res = await getRandomValues({ length: 6, success, complete })

    expect(res.errMsg).toBe('getRandomValues:ok')
    expect(res.randomValues).toBeInstanceOf(ArrayBuffer)
    expect(res.randomValues.byteLength).toBe(6)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(success).toHaveBeenCalledWith(res)
    expect(complete).toHaveBeenCalledWith(res)
    spy.mockRestore()
  })

  test('fills lengths above the per-call quota of crypto.getRandomValues in chunks', async () => {
    const spy = jest.spyOn(window.crypto, 'getRandomValues').mockImplementation(<T extends ArrayBufferView | null>(array: T) => {
      if (!array) return array
      if (array.byteLength > 65536) throw new Error('QuotaExceededError')
      new Uint8Array(array.buffer, array.byteOffset, array.byteLength).fill(1)
      return array
    })

    const { randomValues } = await getRandomValues({ length: 1048576 })

    expect(randomValues.byteLength).toBe(1048576)
    expect(spy).toHaveBeenCalledTimes(16)
    expect(new Uint8Array(randomValues).every(value => value === 1)).toBe(true)
    spy.mockRestore()
  })

  test('fills the last chunk only up to the requested length', async () => {
    const lengths: number[] = []
    const spy = jest.spyOn(window.crypto, 'getRandomValues').mockImplementation(<T extends ArrayBufferView | null>(array: T) => {
      lengths.push(array!.byteLength)
      return array
    })

    const { randomValues } = await getRandomValues({ length: 65537 })

    expect(randomValues.byteLength).toBe(65537)
    expect(lengths).toEqual([65536, 1])
    spy.mockRestore()
  })

  test.each([0, -1, 1.5, 1048577, NaN])('fails when length is %p', async length => {
    const fail = jest.fn()

    await expect(getRandomValues({ length, fail })).resolves.toEqual({
      errMsg: 'getRandomValues:fail parameter error: parameter.length should be an integer between 1 and 1048576'
    })
    expect(fail).toHaveBeenCalledTimes(1)
  })

  test('validates the parameter types', async () => {
    await expect(getRandomValues({ length: '6' as unknown as number })).rejects.toEqual({
      errMsg: 'getRandomValues:fail parameter error: parameter.length should be Number instead of String'
    })
    await expect(getRandomValues(undefined as unknown as Parameters<typeof getRandomValues>[0])).rejects.toEqual({
      errMsg: 'getRandomValues:fail parameter error: parameter should be Object instead of Undefined'
    })
  })

  test('fails when crypto.getRandomValues is not supported', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'crypto')
    Object.defineProperty(window, 'crypto', { configurable: true, value: undefined })

    try {
      await expect(getRandomValues({ length: 6 })).rejects.toEqual({
        errMsg: 'getRandomValues:fail crypto.getRandomValues is not supported'
      })
    } finally {
      if (descriptor) Object.defineProperty(window, 'crypto', descriptor)
      else delete (window as any).crypto
    }
  })
})
