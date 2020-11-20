import * as Taro from '../lib/getLocation'

describe('location', () => {
  describe('getLocation', () => {
    // test('不支持定位时返回执行fail', () => {

    //   const success = jest.fn()
    //   const fail = jest.fn()
    //   const complete = jest.fn()

    //   const expectMsg = 'getLocation fail'

    //   expect.assertions(6)

    //   return Taro.getLocation({
    //     success,
    //     fail,
    //     complete
    //   }).catch((err) => {
    //     expect(success.mock.calls.length).toBe(0)
    //     expect(fail.mock.calls.length).toBe(1)
    //     expect(complete.mock.calls.length).toBe(1)
    //     expect(complete.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
    //     expect(fail.mock.calls[0][0]).toEqual({ errMsg: expectMsg })
    //     expect(err.errMsg).toEqual(expectMsg)
    //   })
    // })

    test('定位功能返回正常参数', () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      const expectData = {
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        speed: expect.any(Number),
        accuracy: expect.any(Number),
        altitude: expect.any(Number),
        verticalAccuracy: expect.any(Number),
        horizontalAccuracy: expect.any(Number),
      }

      expect.assertions(6)

      return Taro.getLocation({
        success,
        fail,
        complete
      }).then((res) => {
        expect(success.mock.calls.length).toBe(1)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual(expect.objectContaining(expectData))
        expect(success.mock.calls[0][0]).toEqual(expect.objectContaining(expectData))
        expect(res).toEqual(expect.objectContaining(expectData))
      })
    })
  })
})
