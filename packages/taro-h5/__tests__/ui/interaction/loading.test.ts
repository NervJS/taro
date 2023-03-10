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

import '@testing-library/jest-dom/extend-expect'

import * as Taro from '@tarojs/taro-h5'

describe('loading', () => {
  test('options.title should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showLoading({
      title: 123,
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showLoading:fail parameter error: parameter.title should be String instead of Number' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('basic test', done => {
    const titleContent = 'xxx'
    const success = jest.fn()
    const complete = jest.fn()
    const errObj = { errMsg: 'showLoading:ok' }

    Taro.showLoading({
      title: titleContent,
      success,
      complete
    })
      .then(res => {
        expect(res).toEqual(errObj)
      })

    const toast: any = document.body.lastChild
    expect(toast.childNodes.length).toBe(2)
    expect(toast).not.toBeVisible()

    const mask = toast.firstChild
    const icon: any = toast.lastChild.firstChild
    const title = toast.lastChild.lastChild
    expect(icon.style.animation).toMatch('taroLoading 1s steps(12, end) infinite')
    expect(title).toHaveTextContent(titleContent)
    expect(success).toHaveBeenCalledWith(errObj)
    expect(complete).toHaveBeenCalledWith(errObj)

    setTimeout(() => {
      expect(toast).toBeVisible()
      expect(mask).not.toBeVisible()
      done()
    }, 200)
  })

  test('should show mask', done => {
    Taro.showLoading({
      title: 'hello',
      mask: true
    })

    const toast: any = document.body.lastChild
    const mask = toast.firstChild

    setTimeout(() => {
      expect(mask).toBeVisible()
      done()
    }, 200)
  })

  test('should hide loading immediately', done => {
    Taro.showLoading()
    Taro.hideLoading()

    const toast = document.body.lastChild

    setTimeout(() => {
      expect(toast).not.toBeVisible()
      done()
    }, 500)
  })
})
