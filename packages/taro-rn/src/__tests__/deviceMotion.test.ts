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

// import { DeviceMotion } from 'expo-sensors'
import * as Taro from '../lib/deviceMotion'

describe('deviceMotion', () => {
  it('should startDeviceMotionListening success', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.startDeviceMotionListening({
      success,
      fail,
      complete,
    })
    expect(success.mock.calls.length).toBe(1)
    expect(fail.mock.calls.length).toBe(0)
    expect(success.mock.calls.length).toBe(1)
  })
  it('should stopDeviceMotionListening success', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.stopDeviceMotionListening({
      success,
      fail,
      complete,
    })
    expect(success.mock.calls.length).toBe(1)
    expect(fail.mock.calls.length).toBe(0)
    expect(success.mock.calls.length).toBe(1)
  })
  // it('should onDeviceMotionChange success', () => {
  //   const change = jest.fn().mockImplementation((ret) => {
  //     expect(0).toBe(0)
  //   })
  //   Taro.onDeviceMotionChange(change)
  // })
})
