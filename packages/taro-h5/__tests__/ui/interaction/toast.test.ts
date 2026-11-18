import '@testing-library/jest-dom/extend-expect'

import * as Taro from '@tarojs/taro-h5'

import { delay } from '../../utils'

describe('toast', () => {
  test('options.title should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showToast({
      title: 123,
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showToast:fail parameter error: parameter.title should be String instead of Number' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('options.duration should be Number', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showToast({
      duration: null,
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showToast:fail parameter error: parameter.duration should be Number instead of Null' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('basic test', async () => {
    const titleContent = 'xxx'
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

    const toast: any = document.body.lastChild
    expect(toast.childNodes.length).toBe(2)
    expect(toast.lastChild).not.toBeVisible()

    const mask = toast.firstChild
    const title = toast.lastChild.lastChild
    // expect(toast.lastChild.firstChild).toHaveTextContent('')
    expect(title).toHaveTextContent(titleContent)

    expect(success).toHaveBeenCalledWith(errObj)
    expect(complete).toHaveBeenCalledWith(errObj)

    await delay(200)
    expect(toast.lastChild).toBeVisible()
    expect(mask).not.toBeVisible()

    await delay(2000)
    expect(toast).not.toBeVisible()
  })

  test('should show corresponding icon', () => {
    Taro.showToast({
      title: 'hello',
      icon: 'none'
    })

    const toast: any = document.body.lastChild
    const icon = toast.lastChild.firstChild

    expect(icon).not.toBeVisible()

    Taro.showToast({
      title: 'hello',
      icon: 'loading'
    })

    expect(icon.style.animation).toMatch('taroLoading 1s steps(12, end) infinite')
  })

  test('should show image', async () => {
    Taro.showToast({
      title: 'github logo',
      image: '//storage.360buyimg.com/taro-static/static/images/icon_githubf.png',
      icon: 'loading'
    })

    const toast: any = document.body.lastChild
    const icon = toast.lastChild.firstChild
    const background = {
      'background-image': 'url(//storage.360buyimg.com/taro-static/static/images/icon_githubf.png)'
    }

    await delay(200)
    expect(icon).toHaveStyle(background)

    Taro.showToast({ title: 'success' })

    await delay(200)
    expect(icon).not.toHaveStyle(background)
    // expect(icon).toHaveTextContent('')
  })

  test('should show mask', async () => {
    Taro.showToast({
      title: 'hello',
      mask: true
    })

    const toast: any = document.body.lastChild
    const mask = toast.firstChild

    await delay(200)
    expect(mask).toBeVisible()
  })

  test('should fade its content instead of the wrapper to keep global stacking levels', () => {
    Taro.showToast({
      title: 'hello',
      mask: true
    })

    const toast: any = document.body.lastChild
    const [mask, content]: any = toast.childNodes

    // opacity < 1 turns an element into a stacking context, so the wrapper must not be faded
    expect(toast.style.opacity).toBe('')
    expect(toast.style.zIndex).toBe('')
    expect(mask.style.zIndex).toBe('1000')
    expect(content.style.zIndex).toBe('5000')
  })

  test('should keep fading the content after being shown again', async () => {
    Taro.showToast({
      title: 'hello',
      duration: 100
    })

    const toast: any = document.body.lastChild
    const content = toast.lastChild

    await delay(500)
    expect(toast).not.toBeVisible()
    expect(content.style.opacity).toBe('0')

    Taro.showToast({
      title: 'again',
      duration: 100
    })
    expect(content.style.transition).toContain('opacity')
    await delay(50)
    expect(content).toBeVisible()
    expect(content.style.opacity).toBe('1')
  })

  test('should close after 5 second', async () => {
    Taro.showToast({
      title: 'hello',
      duration: 3000
    })

    const toast: any = document.body.lastChild

    await delay(2000)
    expect(toast.lastChild).toBeVisible()

    await delay(4000)
    expect(toast).not.toBeVisible()
  }, 10000)

  test('should hide toast immediately', async () => {
    Taro.showToast({
      title: 'hello',
      duration: 30000
    })

    Taro.hideToast()

    const toast = document.body.lastChild
    await delay(500)

    expect(toast).not.toBeVisible()
  })
})
