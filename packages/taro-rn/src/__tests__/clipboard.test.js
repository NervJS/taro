import { Clipboard } from 'react-native'
import MockClipboard from './__mock__/mockClipboard'
import clipboard from '../api/device/clipboard'

const Taro = Object.assign({}, clipboard)

describe('clipboard', () => {
  beforeEach(() => {
    const Clipboard = new MockClipboard()
    jest.setMock('Clipboard', Clipboard)
  })

  describe('setClipboardData', () => {
    test('should set value into Clipboard', async () => {
      const data = 'foo'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(7)
      const res = await Taro.setClipboardData({
        data,
        success,
        fail,
        complete
      })
      const expectMsg = 'setClipboardData:ok'
      expect(success.mock.calls.length).toBe(1)
      expect(success.mock.calls[0][0]).toEqual({ data, errMsg: expectMsg })
      expect(fail.mock.calls.length).toBe(0)
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ data, errMsg: expectMsg })
      expect(res.errMsg).toMatch(expectMsg)

      const clipData = await Clipboard.getString()
      expect(clipData).toEqual(data)
    })

    test('should fail when data is not string', () => {
      const data = {}
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)
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
    test('可以获得正确的剪切板数据', async () => {
      const data = 'hey!hey!hey!'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)
      Clipboard.setString(data)

      const res = await Taro.getClipboardData({
        success,
        fail,
        complete
      })
      const expectErrMsg = 'getClipboardData:ok'
      expect(success.mock.calls.length).toBe(1)
      expect(fail.mock.calls.length).toBe(0)
      expect(success.mock.calls[0][0]).toEqual({ data, errMsg: expectErrMsg })
      expect(complete.mock.calls.length).toBe(1)
      expect(complete.mock.calls[0][0]).toEqual({ data, errMsg: expectErrMsg })
      expect(res.data).toEqual(data)
    })
  })
})
