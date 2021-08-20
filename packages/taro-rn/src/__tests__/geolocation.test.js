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

import * as Taro from '../lib/getLocation'
import { mockGetCurrentPosition } from './__mock__/mockRNCGeolocation'

describe('location', () => {
  describe('getLocation', () => {
    // test('定位功能返回正常参数', () => {
    //   const success = jest.fn()
    //   const fail = jest.fn()
    //   const complete = jest.fn()

    //   const expectData = {
    //     latitude: expect.any(Number),
    //     longitude: expect.any(Number),
    //     speed: expect.any(Number),
    //     accuracy: expect.any(Number),
    //     altitude: expect.any(Number),
    //     verticalAccuracy: expect.any(Number),
    //     horizontalAccuracy: expect.any(Number),
    //   }

    //   expect.assertions(6)

    //   return Taro.getLocation({
    //     success,
    //     fail,
    //     complete
    //   }).then((res) => {
    //     expect(success.mock.calls.length).toBe(1)
    //     expect(fail.mock.calls.length).toBe(0)
    //     expect(complete.mock.calls.length).toBe(1)
    //     expect(complete.mock.calls[0][0]).toEqual(expect.objectContaining(expectData))
    //     expect(success.mock.calls[0][0]).toEqual(expect.objectContaining(expectData))
    //     expect(res).toEqual(expect.objectContaining(expectData))
    //   })
    // })
    test('定位方法正常调用', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      const expectData = {
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        speed: expect.any(Number),
        accuracy: expect.any(Number),
        altitude: expect.any(Number),
        verticalAccuracy: expect.any(Number),
        horizontalAccuracy: expect.any(Number),
      }

      Taro.getLocation({
        success,
        fail,
        complete
      })
      setTimeout(() => {
        expect(mockGetCurrentPosition.mock.calls.length).toBe(1)
      })
    })
  })
})
