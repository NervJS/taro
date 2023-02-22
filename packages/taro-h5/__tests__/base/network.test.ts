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

import * as Taro from '@tarojs/taro-h5'

describe('networkType', () => {
  test('should getNetworkType return Promise that resolve networkType', () => {
    const success = jest.fn()
    const complete = jest.fn()

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

  test('should get networkType from connection.type that does not follow the spec', done => {
    const cbList: any = {}
    // @ts-ignore
    navigator.connection = {
      effectiveType: '4g',
      addEventListener: jest.fn((ev, cb) => {
        cbList[ev] = cb
      })
    }

    setTimeout(() => cbList.change(), 1000)

    Taro.onNetworkStatusChange(ev => {
      expect(ev.isConnected).toBe(true)
      expect(ev.networkType).toBe('4g')
      done()
    })
  })
})
