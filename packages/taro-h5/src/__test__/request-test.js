/* eslint-disable */
import Taro from '../index.js'
Taro.initNativeApi(Taro)

global.fetch = require('jest-fetch-mock')

describe('request', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  test('should return fetch data', () => {
    fetch.once(JSON.stringify({ data: '12345' }))

    return Taro.request({
      url: 'https://github.com',
      data: {
        x: 123,
        y: 'abc',
        z: [1,2,3]
      }
    })
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com?x=123&y=abc&z=1%2C2%2C3')
        expect(res.statusCode).toBe(200)
        expect(res.data).toEqual({
          data: '12345'
        })
      })
  })

  test('should return fetch data when options is url string', () => {
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

    return Taro.request({
      url: 'https://github.com',
      method: 'POST',
      data: {
        arg: 123
      },
      header: {
        'A': 'CCC'
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include'
    })
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com')
        expect(fetch.mock.calls[0][1]).toEqual({
          method: 'POST',
          body: {
            arg: 123
          },
          headers: {
            'A': 'CCC'
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
    fetch.mockReject(new Error('fake error message'))

    return Taro.request('https://github.com')
      .catch(err => {
        expect(err.message).toBe('fake error message')
      })
  })
})
