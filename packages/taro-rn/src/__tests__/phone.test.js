import phone from '../api/device/phone'

const Taro = Object.assign({}, phone)

describe('phone', () => {
  describe('makePhoneCall', () => {
    test('能正常调用电话功能', () => {
      const phoneNumber = '12345678911'
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      expect.assertions(6)

      return Taro.makePhoneCall({
        phoneNumber,
        success,
        fail,
        complete
      }).then((res) => {
        const expectMsg = 'makePhoneCall:ok'
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
