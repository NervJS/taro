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

describe('systemInfo', () => {
  test('should getSystemInfoSync return system information', () => {
    const info = Taro.getSystemInfoSync()
    expect(info).toHaveProperty('brand')
    expect(info).toHaveProperty('model')
    expect(info).toHaveProperty('system')
    expect(info).toHaveProperty('pixelRatio')
    expect(info).toHaveProperty('screenWidth')
    expect(info).toHaveProperty('screenHeight')
    expect(info).toHaveProperty('windowWidth')
    expect(info).toHaveProperty('windowHeight')
    expect(info).toHaveProperty('version')
    expect(info).toHaveProperty('statusBarHeight')
    expect(info).toHaveProperty('platform')
    expect(info).toHaveProperty('language')
    expect(info).toHaveProperty('fontSizeSetting')
    expect(info).toHaveProperty('SDKVersion')
  })

  test('should getSystemInfo return Promise that resolve system information', () => {
    const success = jest.fn()
    const complete = jest.fn()

    expect.assertions(3)
    return Taro.getSystemInfo({
      success,
      complete
    })
      .then(res => {
        expect(success.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
        expect(res).toEqual(Taro.getSystemInfoSync())
      })
  })
})
