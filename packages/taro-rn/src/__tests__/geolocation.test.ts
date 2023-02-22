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

      // const expectData = {
      //   latitude: expect.any(Number),
      //   longitude: expect.any(Number),
      //   speed: expect.any(Number),
      //   accuracy: expect.any(Number),
      //   altitude: expect.any(Number),
      //   verticalAccuracy: expect.any(Number),
      //   horizontalAccuracy: expect.any(Number),
      // }

      Taro.getLocation({
        success,
        fail,
        complete
      }).then(() => {
        expect(mockGetCurrentPosition.mock.calls.length).toBe(1)
      })
    })
  })
})
