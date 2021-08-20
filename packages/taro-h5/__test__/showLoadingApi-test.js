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
import 'jest-dom/extend-expect'

describe('loading', () => {
  test('options.title should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showLoading({
      title: 123,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showLoading:fail parameter error: parameter.title should be String instead of Number' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
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

    const toast = document.body.lastChild
    expect(toast.childNodes.length).toBe(2)
    expect(toast).not.toBeVisible()

    const mask = toast.firstChild
    const icon = toast.lastChild.firstChild
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

    const toast = document.body.lastChild
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
