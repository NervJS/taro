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

import { DeviceEventEmitter } from 'react-native'
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
    const change = jest.fn().mockImplementation(({ height }) => expect(height).toBe(endCoordinates.height))
    Taro.onKeyboardHeightChange(change)
    DeviceEventEmitter.emit('keyboardDidShow', { endCoordinates })
    expect(change.mock.calls.length).toBe(1)
    endCoordinates.height = 0
    DeviceEventEmitter.emit('keyboardDidHide', { endCoordinates })
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
    DeviceEventEmitter.emit('keyboardDidShow', { endCoordinates })
    expect(firstChange.mock.calls.length).toBe(1)
    expect(secondChange.mock.calls.length).toBe(1)
    Taro.offKeyboardHeightChange(secondChange)
    DeviceEventEmitter.emit('keyboardDidHide', { endCoordinates })
    expect(firstChange.mock.calls.length).toBe(2)
    expect(secondChange.mock.calls.length).toBe(1)
  })
})
