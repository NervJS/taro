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

/* eslint-disable */
import * as Taro from '../src/api'
describe('others', () => {
  test('should covert arraybuffer to base64', () => {
    const arrayBuffer = new Uint8Array([11, 22, 33])
    const base64 = Taro.arrayBufferToBase64(arrayBuffer)
    expect(base64).toBe('CxYh')
  })

  test('should covert base64 to arraybuffer', () => {
    const base64 = 'CxYh'
    const arrayBuffer = Taro.base64ToArrayBuffer(base64)
    expect(arrayBuffer[0]).toBe(11)
    expect(arrayBuffer[1]).toBe(22)
    expect(arrayBuffer[2]).toBe(33)
  })
})
