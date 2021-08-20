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
