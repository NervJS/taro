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

import { Keyboard } from 'react-native'
import * as Taro from '../lib/keyboard'

describe('keyboard', () => {
  it('should hideKeyboard success', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.hideKeyboard({
      success,
      fail,
      complete,
    })
    expect(success.mock.calls.length).toBe(1)
    expect(fail.mock.calls.length).toBe(0)
    expect(success.mock.calls.length).toBe(1)
  })
  it('should onKeyboardHeightChange success', () => {
    expect.assertions(4)
    const endCoordinates = { height: 200 }
    const change = jest.fn().mockImplementation(height => expect(height).toBe(endCoordinates.height))
    Taro.onKeyboardHeightChange(change)
    Keyboard.emit('keyboardDidShow', { endCoordinates })
    expect(change.mock.calls.length).toBe(1)
    endCoordinates.height = 0
    Keyboard.emit('keyboardDidHide', { endCoordinates })
    expect(change.mock.calls.length).toBe(2)
    Taro.offKeyboardHeightChange(change)
  })

  it('should offKeyboardHeightChange success', () => {
    expect.assertions(4)
    const endCoordinates = { height: 200 }
    const firstChange = jest.fn()
    const secondChange = jest.fn()
    Taro.onKeyboardHeightChange(firstChange)
    Taro.onKeyboardHeightChange(secondChange)
    Keyboard.emit('keyboardDidShow', { endCoordinates })
    expect(firstChange.mock.calls.length).toBe(1)
    expect(secondChange.mock.calls.length).toBe(1)
    Taro.offKeyboardHeightChange(secondChange)
    Keyboard.emit('keyboardDidHide', { endCoordinates })
    expect(firstChange.mock.calls.length).toBe(2)
    expect(secondChange.mock.calls.length).toBe(1)
  })
})
