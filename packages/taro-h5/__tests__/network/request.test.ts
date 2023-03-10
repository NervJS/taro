/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

const fetch = require('jest-fetch-mock')

// @ts-ignore
global.fetch = fetch

describe('request', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  test('should return fetch data', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    fetch.once(JSON.stringify({ data: '12345' }))

    expect.assertions(6)
    return Taro.request({
      url: 'https://github.com',
      data: {
        x: 123,
        y: 'abc',
        z: [1, 2, 3]
      },
      success,
      fail,
      complete
    })
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com?x=123&y=abc&z=%5B1%2C2%2C3%5D')
        expect(res.statusCode).toBe(200)
        expect(res.data).toEqual({
          data: '12345'
        })
        expect(success.mock.calls.length).toBe(1)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
      })
  })

  test.skip('should return fetch data when options is url string', () => {
    fetch.once(JSON.stringify({ data: '12345' }))

    return Taro.request('https://github.com')
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com?')
        expect(res.statusCode).toBe(200)
        expect(res.data).toEqual({
          data: '12345'
        })
      })
  })

  test('should set correct params', () => {
    fetch.once(JSON.stringify({ data: '12345' }), { status: 201 })

    expect.assertions(4)
    return Taro.request({
      url: 'https://github.com',
      method: 'POST',
      data: {
        arg: 123
      },
      header: {
        A: 'CCC'
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include'
    })
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com')
        expect(fetch.mock.calls[0][1]).toEqual({
          method: 'POST',
          body: JSON.stringify({ arg: 123 }),
          headers: {
            A: 'CCC',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include'
        })
        expect(res.statusCode).toBe(201)
        expect(res.data).toEqual({
          data: '12345'
        })
      })
  })

  test('should catch error', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    fetch.mockReject(new Error('fake error message'))

    expect.assertions(5)
    return Taro.request({
      url: 'https://github.com',
      success,
      fail,
      complete
    })
      .catch(err => {
        expect(err.message).toBe('fake error message')
        expect(err.errMsg).toBe('fake error message')
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
      })
  })

  test('should no error by status 400', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    fetch.mockResponse(null, {
      counter: 1,
      status: 400,
      statusText: 'missing parameter',
    })

    expect.assertions(5)
    return Taro.request({
      url: 'https://github.com',
      success,
      fail,
      complete
    })
      .then(res => {
        expect(res.statusCode).toBe(400)
        expect(res.data).toBe(null)
        expect(success.mock.calls.length).toBe(1)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
      })
  })
})
