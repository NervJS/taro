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

describe('toast', () => {
  test('options.title should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showToast({
      title: 123,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showToast:fail parameter error: parameter.title should be String instead of Number' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.duration should be Number', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showToast({
      duration: null,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showToast:fail parameter error: parameter.duration should be Number instead of Null' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('basic test', done => {
    const titleContent = 'xxx'
    const successIconContent = ''
    const success = jest.fn()
    const complete = jest.fn()
    const errObj = { errMsg: 'showToast:ok' }

    Taro.showToast({
      title: titleContent,
      icon: 'success',
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
    expect(icon).toHaveTextContent(successIconContent)
    expect(title).toHaveTextContent(titleContent)

    expect(success).toHaveBeenCalledWith(errObj)
    expect(complete).toHaveBeenCalledWith(errObj)

    setTimeout(() => {
      expect(toast).toBeVisible()
      expect(mask).not.toBeVisible()
    }, 200)

    setTimeout(() => {
      expect(toast).not.toBeVisible()
      done()
    }, 2000)
  })

  test('should show corresponding icon', () => {
    Taro.showToast({
      title: 'hello',
      icon: 'none'
    })

    const toast = document.body.lastChild
    const icon = toast.lastChild.firstChild

    expect(icon).not.toBeVisible()

    Taro.showToast({
      title: 'hello',
      icon: 'loading'
    })

    expect(icon.style.animation).toMatch('taroLoading 1s steps(12, end) infinite')
  })

  test('should show image', () => {
    Taro.showToast({
      title: 'github logo',
      image: '//storage.360buyimg.com/taro-static/static/images/icon_githubf.png',
      icon: 'loading'
    })

    const toast = document.body.lastChild
    const icon = toast.lastChild.firstChild
    const background = 'background-image: url(//storage.360buyimg.com/taro-static/static/images/icon_githubf.png)'

    expect(icon).toHaveStyle(background)

    Taro.showToast({ title: 'success' })

    expect(icon).not.toHaveStyle(background)
    expect(icon).toHaveTextContent('')
  })

  test('should show mask', done => {
    Taro.showToast({
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

  test('should close after 5 second', done => {
    Taro.showToast({
      title: 'hello',
      duration: 3000
    })

    const toast = document.body.lastChild

    setTimeout(() => {
      expect(toast).toBeVisible()
      done()
    }, 2000)

    setTimeout(() => {
      expect(toast).not.toBeVisible()
      done()
    }, 4000)
  })

  test('should hide toast immediately', done => {
    Taro.showToast({
      title: 'hello',
      duration: 30000
    })

    Taro.hideToast()

    const toast = document.body.lastChild

    setTimeout(() => {
      expect(toast).not.toBeVisible()
      done()
    }, 500)
  })
})
