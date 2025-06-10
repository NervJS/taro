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
