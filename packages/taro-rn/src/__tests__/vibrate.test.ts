import * as vibrate from '../lib/vibrate'

const Taro = Object.assign({}, vibrate)

describe('vibrate', () => {
  describe('vibrateShort', () => {
    test('能正常震动', () => {
      const expectMsg = 'vibrateShort:ok'

      expect.assertions(1)
      return Taro.vibrateShort().then((res) => {
        expect(res.errMsg).toMatch(expectMsg)
      })
    })
  })

  describe('vibrateLong', () => {
    test('能正常震动', () => {
      const expectMsg = 'vibrateLong:ok'

      expect.assertions(1)
      return Taro.vibrateLong().then((res) => {
        expect(res.errMsg).toMatch(expectMsg)
      })
    })
  })
})
