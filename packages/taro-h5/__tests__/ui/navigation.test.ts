import * as Taro from '@tarojs/taro-h5'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { buildApp } from '../utils'

describe('navigation', () => {
  describe('setNavigationBarTitle', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    test('options should be object', () => {
      expect.assertions(2)
      return Promise.all([
        Taro.setNavigationBarTitle()
          .catch(err => {
            const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter should be Object instead of Undefined'
            // expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          }),
        Taro.setNavigationBarTitle(null)
          .catch(err => {
            const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter should be Object instead of Null'
            // expect(console.error).toHaveBeenNthCalledWith(2, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          })
      ])
    })

    test('options.title should be string', () => {
      const success = vi.fn()
      const fail = vi.fn()
      const complete = vi.fn()

      expect.assertions(5)
      return Taro.setNavigationBarTitle({
        success,
        fail,
        complete
      })
        .then(() => {
          const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter.title should be String instead of Undefined'
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          // expect(console.error).toHaveBeenCalledWith(expectErrMsg)
          // expect(err.errMsg).toMatch(expectErrMsg)
        })
    })

    test('should save to setNavigationBarTitle', () => {
      const title = 'bar'
      const success = vi.fn()
      const fail = vi.fn()
      const complete = vi.fn()

      expect.assertions(6)
      return Taro.setNavigationBarTitle({
        title,
        success,
        fail,
        complete
      })
        .then(res => {
          const expectMsg = 'setNavigationBarTitle:ok'
          expect(success.mock.calls.length).toBe(1)
          expect(success.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
          expect(fail.mock.calls.length).toBe(0)
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
          expect(res.errMsg).toMatch(expectMsg)
        })
    })
  })
  describe('showNavigationBarLoading / hideNavigationBarLoading', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      buildApp()
    })

    test('should be able to showNavigationBarLoading / hideNavigationBarLoading', async () => {
      const res = await Taro.showNavigationBarLoading()
      expect(res.errMsg).toBe('showNavigationBarLoading:ok')
      let loadingElement = document.querySelector('.taro-navigation-bar-loading-show')
      expect(loadingElement).toBeTruthy()

      const res2 = await Taro.hideNavigationBarLoading()
      expect(res2.errMsg).toBe('hideNavigationBarLoading:ok')
      loadingElement = document.querySelector('.taro-navigation-bar-loading-show')
      expect(loadingElement).toBeFalsy()
    })
  })
})
