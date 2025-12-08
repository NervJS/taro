import { describe, expect, test, vi } from 'vitest'

import * as Taro from '../../src/index'

describe('networkType', () => {
  test('should getNetworkType return Promise that resolve networkType', () => {
    const success = vi.fn()
    const complete = vi.fn()

    // @ts-ignore
    navigator.connection = {
      effectiveType: '4g'
    }

    expect.assertions(3)
    return Taro.getNetworkType({
      success,
      complete
    })
      .then(res => {
        expect(success.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
        expect(res.networkType).toBe('4g')
      })
  })

  test('should get networkType from connection.type', () => {
    // @ts-ignore
    navigator.connection = {
      type: 'wifi'
    }

    expect.assertions(1)
    return Taro.getNetworkType()
      .then(res => {
        expect(res.networkType).toBe('wifi')
      })
  })

  test('should get networkType from connection.type that does not follow the spec', () => {
    // @ts-ignore
    navigator.connection = {
      type: '3',
      UNKNOWN: '0',
      ETHERNET: '1',
      WIFI: '2',
      CELL_2G: '3',
      CELL_3G: '4'
    }

    expect.assertions(1)
    return Taro.getNetworkType()
      .then(res => {
        expect(res.networkType).toBe('2g')
      })
  })

  test('should trigger onNetworkStatusChange when connection changes', () => {
    return new Promise<void>(resolve => {
      const cbList: any = {}
      // @ts-ignore
      navigator.connection = {
        effectiveType: '4g',
        addEventListener: vi.fn((ev, cb) => {
          cbList[ev] = cb
        })
      }

      setTimeout(() => cbList.change(), 1000)

      Taro.onNetworkStatusChange(ev => {
        expect(ev.isConnected).toBe(true)
        expect(ev.networkType).toBe('4g')
        resolve()
      })
    })
  })
})
