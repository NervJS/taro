/* eslint-disable */
import * as Taro from '../src/api'

global.fetch = require('jest-fetch-mock')

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
        z: [1,2,3]
      },
      success,
      fail,
      complete
    })
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com?x=123&y=abc&z=1%2C2%2C3')
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
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    fetch.mockReject(new Error('fake error message'))

    expect.assertions(4)
    return Taro.request({
      url: 'https://github.com',
      success,
      fail,
      complete
    })
      .catch(err => {
        expect(err.message).toBe('fake error message')
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
      })
  })
})
