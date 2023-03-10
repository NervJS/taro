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

const mockConsole = require('jest-mock-console')

describe('navigation', () => {
  describe('setNavigationBarTitle', () => {
    beforeEach(() => {
      mockConsole()
    })

    test('options should be object', () => {
      expect.assertions(2)
      return Promise.all([
        Taro.setNavigationBarTitle()
          .catch(err => {
            const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter should be Object instead of Undefined'
            // expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          }),
        Taro.setNavigationBarTitle(null)
          .catch(err => {
            const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter should be Object instead of Null'
            // expect(console.error).toHaveBeenNthCalledWith(2, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          })
      ])
    })

    test('options.title should be string', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(5)
      return Taro.setNavigationBarTitle({
        success,
        fail,
        complete
      })
        .then(() => {
          const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter.title should be String instead of Undefined'
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
          // expect(err.errMsg).toMatch(expectErrMsg)
        })
    })

    test('should save to setNavigationBarTitle', () => {
      const title = 'bar'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)
      return Taro.setNavigationBarTitle({
        title,
        success,
        fail,
        complete
      })
        .then(res => {
          const expectMsg = 'setNavigationBarTitle:ok'
          expect(success.mock.calls.length).toBe(1)
          expect(success.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
          expect(fail.mock.calls.length).toBe(0)
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
          expect(res.errMsg).toMatch(expectMsg)
        })
    })
  })
})
