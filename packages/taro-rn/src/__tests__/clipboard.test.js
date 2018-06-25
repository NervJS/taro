import Taro from '../index.js'

Taro.initNativeApi(Taro)

describe('clipboard', () => {
  describe('setClipboardData', () => {
    test('should set value into Clipboard', () => {
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      return Taro.setClipboardData({
        data,
        success,
        fail,
        complete
      }).then((res) => {
        const expectMsg = 'setClipboardData:ok'
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toEqual({ data, errMsg: expectMsg })
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ data, errMsg: expectMsg })
        expect(res.errMsg).toMatch(expectMsg)
      })
    })

    test('should fail when data is not string', () => {
      const data = {}
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      return Taro.setClipboardData({
        data,
        success,
        fail,
        complete
      }).catch(err => {
        const expectErrMsg = 'setClipboardData:fail parameter error: parameter.data should be String'
        expect(success.mock.calls.length).toBe(0)
        expect(fail.mock.calls.length).toBe(1)
        expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectErrMsg })
        expect(err.errMsg).toMatch(expectErrMsg)
      })
    })
  })

  describe('getClipboardData', () => {
    // 似乎不能模拟Clipboard.getString方法，所以暂时搁置
  })
})
