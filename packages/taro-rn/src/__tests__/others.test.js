/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
