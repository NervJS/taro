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

import { getSystemInfo } from '../lib/getSystemInfo'
import { getSystemInfoSync } from '../lib/getSystemInfoSync'

const Taro = { getSystemInfo, getSystemInfoSync }

describe('system', () => {
  describe('getSystemInfoSync', () => {
    test('能同步返回正确的系统信息', () => {
      const expectRes = {
        brand: expect.any(String),
        model: expect.any(String),
        pixelRatio: expect.any(Number),
        safeArea: expect.any(Object),
        screenWidth: expect.any(Number),
        screenHeight: expect.any(Number),
        windowWidth: expect.any(Number),
        windowHeight: expect.any(Number),
        statusBarHeight: expect.any(Number),
        language: null,
        version: expect.any(String),
        system: expect.any(String),
        platform: expect.any(String),
        fontSizeSetting: expect.any(Number),
        SDKVersion: null
      }

      const res = Taro.getSystemInfoSync()
      expect(res).toEqual(expect.objectContaining(expectRes))
    })
  })

  describe('getSystemInfo', () => {
    test('能异步返回正确的系统信息', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()
      const expectRes = {
        brand: expect.any(String),
        model: expect.any(String),
        pixelRatio: expect.any(Number),
        safeArea: expect.any(Object),
        screenWidth: expect.any(Number),
        screenHeight: expect.any(Number),
        windowWidth: expect.any(Number),
        windowHeight: expect.any(Number),
        statusBarHeight: expect.any(Number),
        language: null,
        version: expect.any(String),
        system: expect.any(String),
        platform: expect.any(String),
        fontSizeSetting: expect.any(Number),
        SDKVersion: null
      }

      expect.assertions(4)

      return Taro.getSystemInfo({
        success,
        fail,
        complete
      }).then((res) => {
        expect(success.mock.calls.length).toBe(1)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(res).toEqual(expect.objectContaining(expectRes))
      })
    })
  })
})
