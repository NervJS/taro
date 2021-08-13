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
