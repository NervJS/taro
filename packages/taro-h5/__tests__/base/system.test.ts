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

import * as Taro from '@tarojs/taro-h5'

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
    const info = Taro.getSystemInfoSync()
    return Taro.getSystemInfo({
      success,
      complete
    })
      .then(res => {
        expect(success.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
        expect(res).toEqual({
          ...info,
          errMsg: 'getSystemInfo:ok'
        })
      })
  })
})
