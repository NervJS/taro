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

describe('modal', () => {
  test('options.title should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      title: null,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail parameter error: parameter.title should be String instead of Null' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.content should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      content: undefined,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail parameter error: parameter.content should be String instead of Undefined' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.cancelText should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      cancelText: 1,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail parameter error: parameter.cancelText should be String instead of Number' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.cancelText should not larger than 4 Chinese characters', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      cancelText: '最多四个字',
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail cancelText length should not larger then 4 Chinese characters' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.confirmText should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      confirmText: 1,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail parameter error: parameter.confirmText should be String instead of Number' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.confirmText should not larger than 4 Chinese characters', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      confirmText: '最多四个字',
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail confirmText length should not larger then 4 Chinese characters' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.cancelColor should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      cancelColor: 1,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail parameter error: parameter.cancelColor should be String instead of Number' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('options.confirmColor should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    expect.assertions(4)
    Taro.showModal({
      confirmColor: 1,
      success,
      fail,
      complete
    })
      .catch(err => {
        const excpectErrObj = { errMsg: 'showModal:fail parameter error: parameter.confirmColor should be String instead of Number' }
        expect(success.mock.calls.length).toBe(0)
        expect(fail).toHaveBeenCalledWith(excpectErrObj)
        expect(complete).toHaveBeenCalledWith(excpectErrObj)
        expect(err).toEqual(excpectErrObj)
      })
  })

  test('basic test', done => {
    const titleText = 'xxx'
    const contentText = 'hello world'
    const cancelText = '取消'
    const confirmText = '确定'
    const success = jest.fn()
    const complete = jest.fn()

    Taro.showModal({
      title: titleText,
      content: contentText,
      success,
      complete
    })
      .then(res => {
        const errObj = {
          errMsg: 'showModal:ok',
          cancel: false,
          confirm: true
        }
        expect(success).toHaveBeenCalledWith(errObj)
        expect(complete).toHaveBeenCalledWith(errObj)
        expect(res).toEqual(errObj)
        done()
      })

    const modal = document.body.lastChild
    const mask = modal.firstChild
    expect(modal.childNodes.length).toBe(2)
    expect(modal).not.toBeVisible()

    const title = modal.lastChild.firstChild
    const content = modal.lastChild.children[1]
    expect(title).toHaveTextContent(titleText)
    expect(content).toHaveTextContent(contentText)

    const foot = modal.lastChild.lastChild
    expect(foot.childNodes.length).toBe(2)

    const cancel = foot.firstChild
    const confirm = foot.lastChild
    expect(cancel).toHaveTextContent(cancelText)
    expect(cancel).toHaveStyle('color: rgb(0, 0, 0)')
    expect(confirm).toHaveTextContent(confirmText)
    expect(confirm).toHaveStyle('color: rgb(60, 197, 31)')

    setTimeout(() => {
      expect(modal).toBeVisible()
      expect(mask).toBeVisible()
      confirm.click()
    }, 200)
  })

  test('should res.cancel be true', done => {
    const success = jest.fn()
    const complete = jest.fn()

    Taro.showModal({
      success,
      complete
    })
      .then(res => {
        const errObj = {
          errMsg: 'showModal:ok',
          cancel: true,
          confirm: false
        }
        expect(success).toHaveBeenCalledWith(errObj)
        expect(complete).toHaveBeenCalledWith(errObj)
        expect(res).toEqual(errObj)
        done()
      })

    const modal = document.body.lastChild
    const foot = modal.lastChild.lastChild
    const cancel = foot.firstChild

    setTimeout(() => {
      cancel.click()
    }, 200)
  })

  test('should user setting display correct', () => {
    const cancelText = 'cancel'
    const cancelColor = 'yellow'
    const confirmText = 'confirm'
    const confirmColor = 'green'

    Taro.showModal({
      cancelText,
      cancelColor,
      confirmText,
      confirmColor
    })

    const modal = document.body.lastChild
    const foot = modal.lastChild.lastChild
    const cancel = foot.firstChild
    const confirm = foot.lastChild

    expect(cancel).toHaveTextContent(cancelText)
    expect(cancel).toHaveStyle(`color: ${cancelColor}`)
    expect(confirm).toHaveTextContent(confirmText)
    expect(confirm).toHaveStyle(`color: ${confirmColor}`)
  })

  test('should not show cancel button', done => {
    Taro.showModal({
      showCancel: false
    })

    const modal = document.body.lastChild
    const foot = modal.lastChild.lastChild
    expect(foot.childNodes.length).toBe(2)

    const cancel = foot.firstChild
    const confirm = foot.lastChild

    setTimeout(() => {
      expect(cancel).not.toBeVisible()
      expect(confirm).toBeVisible()
      done()
    }, 200)
  })

  test('should show another style when options.title is empty', done => {
    Taro.showModal({})

    const modal = document.body.lastChild
    const title = modal.lastChild.firstChild
    const content = modal.lastChild.children[1]

    expect(title).toHaveTextContent('')
    expect(content).toHaveTextContent('')

    setTimeout(() => {
      expect(title).not.toBeVisible()
      expect(content).toHaveStyle(`
        padding: 40px 20px 26px;
        color: rgb(53, 53, 53);
      `)
      done()
    }, 200)
  })
})
