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

import Clipboard from '@react-native-clipboard/clipboard'
import { getClipboardData } from '../lib/getClipboardData'
import { setClipboardData } from '../lib/setClipboardData'

const Taro = {
  setClipboardData,
  getClipboardData
}

// 原生模块导出缺少 react_native_1.NativeModules.RNCClipboar setup mock

describe('clipboard', () => {
  describe('setClipboardData', () => {
    test('should set value into Clipboard', async () => {
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(7)
      const res = await Taro.setClipboardData({
        data,
        success,
        fail,
        complete
      })
      const expectMsg = 'setClipboardData:ok'
      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual({ data, errMsg: expectMsg })
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ data, errMsg: expectMsg })
      expect(res.errMsg).toMatch(expectMsg)

      const clipData = await Clipboard.getString()
      expect(clipData).toEqual(data)
    })

    test('should fail when data is not string', () => {
      const data = {}
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      // expect.assertions(6)
      return Taro.setClipboardData({
        // @ts-ignore
        data,
        success,
        fail,
        complete
      }).catch(err => {
        const expectErrMsg = 'setClipboardData:fail parameter error: parameter.data should be String'
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(err.errMsg).toMatch(expectErrMsg)
      })
    })
  })

  describe('getClipboardData', () => {
    test('可以获得正确的剪切板数据', async () => {
      const data = 'hey!hey!hey!'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)
      Clipboard.setString(data)

      const res = await Taro.getClipboardData({
        success,
        fail,
        complete
      })
      const expectErrMsg = 'getClipboardData:ok'
      expect(success.mock.calls.length).toBe(1)
      expect(fail.mock.calls.length).toBe(0)
      expect(success.mock.calls[0][0]).toEqual({ data, errMsg: expectErrMsg })
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ data, errMsg: expectErrMsg })
      expect(res.data).toEqual(data)
    })
  })
})
