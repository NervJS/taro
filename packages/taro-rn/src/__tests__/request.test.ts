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

import * as request from '../lib/request'

const Taro = Object.assign({}, request)

describe('request', () => {
  beforeEach(() => {
    const fetch = jest.fn(() => {
      return new Promise((resolve) => {
        resolve({
          ok: true,
          status: 200,
          headers: {},
          json: () => {
            return Promise.resolve({ data: 'calorie' })
          },
          text: () => {
            return Promise.resolve('卡路里卡路里卡路')
          }
        })
      })
    })
    // @ts-ignore
    global.fetch = fetch
  })

  describe('request', () => {
    // taro@3 不支持
    // test('直接传入url时能正常返回', async () => {
    //   const expectData = { data: 'calorie' }

    //   const url = 'https://test.taro.com/v1'
    //   const res = await Taro.request(url)

    //   expect(res.data).toEqual(expectData)
    // })

    test('接口数据返回json对象', async () => {
      const expectData = { data: 'calorie' }

      const url = 'https://test.taro.com/v1'
      const options = {
        url,
        dataType: 'json'
      }
      const res = await Taro.request(options)

      expect(res.data).toEqual(expectData)
    })

    test('接口数据返回text', async () => {
      const expectData = { data: 'calorie' }

      const url = 'https://test.taro.com/v1'
      const options = {
        url,
        responseType: 'text'
      }
      // @ts-ignore
      const res = await Taro.request(options)
      expect(res.data).toEqual(expectData)
    })

    it('RN请求入参同于微信小程序', () => {
      const url = 'https://test.taro.com/v1'
      const expectData = JSON.stringify({ data: 'calorie' })
      const options = {
        url,
        dataType: 'json',
        complete: jest.fn(),
        success: (res) => {
          expect(JSON.stringify(res.data)).toMatch(expectData)
        },
        fail: jest.fn()
      }
      Taro.request(options)
    })

    test('数据被序列化', async () => {
      const fetch = jest.fn((url, params) => {
        return new Promise((resolve) => {
          resolve({
            ok: true,
            status: 200,
            headers: {},
            json: () => {
              return Promise.resolve({ url, params })
            },
            text: () => {
              return Promise.resolve('卡路里卡路里卡路')
            }
          })
        })
      })
      // @ts-ignore
      global.fetch = fetch

      const url = 'https://test.taro.com/v1'
      const optionsOne = {
        url,
        dataType: 'json',
        data: {
          a: 1
        }
      }

      const expectUrl = `https://test.taro.com/v1?${encodeURIComponent('a')}=${encodeURIComponent(1)}`
      // @ts-ignore
      const res = await Taro.request(optionsOne)
      expect(res.data.url).toMatch(expectUrl)

      const optionsTwo = {
        url,
        method: 'post',
        dataType: 'json',
        header: {
          'content-type': 'application/json;charset=UTF-8'
        },
        data: {
          a: 1
        }
      }

      const expectBodyOne = JSON.stringify({ a: 1 })
      // @ts-ignore
      const resTwo = await Taro.request(optionsTwo)
      expect(resTwo.data.params.body).toMatch(expectBodyOne)

      const optionsThree = {
        url,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          a: 1
        }
      }

      const expectBodyTwo = `${encodeURIComponent('a')}=${encodeURIComponent(1)}`
      // @ts-ignore
      const resThree = await Taro.request(optionsThree)
      expect(resThree.data.params.body).toMatch(expectBodyTwo)
    })
  })
})
