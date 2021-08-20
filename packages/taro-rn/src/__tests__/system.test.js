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

import { getSystemInfo } from '../lib/getSystemInfo'
import { getSystemInfoSync } from '../lib/getSystemInfoSync'

const Taro = { getSystemInfo, getSystemInfoSync }

describe('system', () => {
  describe('getSystemInfoSync', () => {
    test('能同步返回正确的系统信息', () => {
      const expectRes = {
        brand: null,
        model: null,
        pixelRatio: expect.any(Number),
        safeArea: expect.any(Object),
        screenWidth: expect.any(Number),
        screenHeight: expect.any(Number),
        windowWidth: expect.any(Number),
        windowHeight: expect.any(Number),
        statusBarHeight: expect.any(Number),
        language: null,
        version: null,
        system: undefined,
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
        brand: null,
        model: null,
        pixelRatio: expect.any(Number),
        safeArea: expect.any(Object),
        screenWidth: expect.any(Number),
        screenHeight: expect.any(Number),
        windowWidth: expect.any(Number),
        windowHeight: expect.any(Number),
        statusBarHeight: expect.any(Number),
        language: null,
        version: null,
        system: undefined,
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
