/* eslint-disable */
import * as Taro from '../src/api'
import mockConsole from 'jest-mock-console'

describe('navigation', () => {
  describe('setNavigationBarTitle', () => {
    test('options should be object', () => {
      mockConsole()

      expect.assertions(4)
      return Promise.all([
        Taro.setNavigationBarTitle()
          .catch(err => {
            const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter should be Object instead of Undefined'
            expect(console.error).toHaveBeenNthCalledWith(1, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          }),
        Taro.setNavigationBarTitle(null)
          .catch(err => {
            const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter should be Object instead of Null'
            expect(console.error).toHaveBeenNthCalledWith(2, expectErrMsg)
            expect(err.errMsg).toMatch(expectErrMsg)
          })
      ])
    })

    test('options.title should be string', () => {
      mockConsole()
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(7)
      return Taro.setNavigationBarTitle({
        success,
        fail,
        complete
      })
        .catch(err => {
          const expectErrMsg = 'setNavigationBarTitle:fail parameter error: parameter.title should be String instead of Undefined'
          expect(success.mock.calls.length).toBe(0)
          expect(fail.mock.calls.length).toBe(1)
          expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(complete.mock.calls.length).toBe(1)
          expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
          expect(console.error).toHaveBeenCalledWith(expectErrMsg)
          expect(err.errMsg).toMatch(expectErrMsg)
        })
    })

    test('should save to setNavigationBarTitle', () => {
      const title = 'bar'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

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
})
