import { beforeEach, describe, expect, test, vi } from 'vitest'

import * as Taro from '../../src/index'

const fetch = vi.fn()
global.fetch = fetch

function mockFetchOnce (body: string, init?: { status?: number, statusText?: string }) {
  fetch.mockResolvedValueOnce({
    ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
    status: init?.status || 200,
    statusText: init?.statusText || 'OK',
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
    headers: new Map()
  })
}

function mockFetchReject (error: Error) {
  fetch.mockRejectedValueOnce(error)
}

describe('request', () => {
  beforeEach(() => {
    fetch.mockReset()
  })

  test('should return fetch data', () => {
    const success = vi.fn()
    const fail = vi.fn()
    const complete = vi.fn()

    mockFetchOnce(JSON.stringify({ data: '12345' }))

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

  test('should return fetch data when options is url string', () => {
    mockFetchOnce(JSON.stringify({ data: '12345' }))

    return Taro.request('https://github.com')
      .then(res => {
        expect(fetch.mock.calls[0][0]).toBe('https://github.com')
        expect(res.statusCode).toBe(200)
        expect(res.data).toEqual({
          data: '12345'
        })
      })
  })

  test('should set correct params', () => {
    mockFetchOnce(JSON.stringify({ data: '12345' }), { status: 201 })

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
          credentials: 'include',
          signal: new window.AbortController().signal
        })
        expect(res.statusCode).toBe(201)
        expect(res.data).toEqual({
          data: '12345'
        })
      })
  })

  test('should catch error', () => {
    const success = vi.fn()
    const fail = vi.fn()
    const complete = vi.fn()

    mockFetchReject(new Error('fake error message'))

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
    const success = vi.fn()
    const fail = vi.fn()
    const complete = vi.fn()

    mockFetchOnce('null', {
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

  test('should abort request when it timeout', () => {
    const success = vi.fn()
    const fail = vi.fn()
    const complete = vi.fn()

    fetch.mockImplementationOnce((url, options) => new Promise((resolve, reject) => {
      const signal = options?.signal
      if (signal) {
        if (signal.aborted) {
          reject(new DOMException('The operation was aborted.', 'AbortError'))
          return
        }
        signal.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'))
        })
      }
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ body: 'ok' }),
          text: () => Promise.resolve(JSON.stringify({ body: 'ok' })),
          headers: new Map()
        })
      }, 3000)
    }))

    expect.assertions(6)
    return Taro.request({
      url: 'https://github.com',
      timeout: 30,
      success,
      fail,
      complete
    })
      .catch(err => {
        expect(err.code).toBe(20)
        expect(err.message).toBe('The operation was aborted.')
        expect(err.name).toBe('AbortError')
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
      })
  })
})
