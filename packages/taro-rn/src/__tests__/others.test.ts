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

import { base64ToArrayBuffer } from '../lib/base64ToArrayBuffer'
import { arrayBufferToBase64 } from '../lib/arrayBufferToBase64'

const Taro = { base64ToArrayBuffer, arrayBufferToBase64 }

describe('base64 and arrayBuffer', () => {
  describe('arrayBufferToBase64', () => {
    test('能正常转换为base64', () => {
      const expectBase64 = 'CxZY'
      const arrayBuffer = new Uint8Array([11, 22, 88])
      const base64 = Taro.arrayBufferToBase64(arrayBuffer)
      expect(base64).toBe(expectBase64)
    })
  })

  describe('base64ToArrayBuffer', () => {
    test('能正常转换为ArrayBuffer', () => {
      const base64 = 'CxZY'
      const arrayBuffer = Taro.base64ToArrayBuffer(base64)
      expect(arrayBuffer[0]).toBe(11)
      expect(arrayBuffer[1]).toBe(22)
      expect(arrayBuffer[2]).toBe(88)
    })
  })
})
