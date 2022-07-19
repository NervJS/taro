import * as network from '../lib/network'
const Taro = Object.assign({}, network)

describe('network', () => {
  describe('getNetworkType', () => {
    test('能正常返回网络类型', () => {
      const networkType = expect.any(String)
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      return Taro.getNetworkType({
        success,
        fail,
        complete
      }).then((res) => {
        expect.assertions(6)
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toEqual({ networkType, errMsg: 'getNetworkType:ok' })
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ networkType, errMsg: 'getNetworkType:ok' })
        expect(res.networkType).toEqual(networkType)
      })
    })
  })
  // mock react_native_1.NativeModules.RNCNetInfo 暂不mock 内部实现，比如事件的发布订阅
  // describe('onNetworkStatusChange', () => {
  //   test('能够正常监听网络状态的变化', done => {
  //     const networkType = '3g'
  //     const networkCb = (res) => {
  //       expect(res).toEqual({ networkType, isConnected: true })
  //       done()
  //     }
  //     expect.assertions(1)

  //     Taro.onNetworkStatusChange(networkCb)
  //     NetInfo.changeNetworkType('cellular', networkType)
  //     NetInfo.fetch().then(state => {
  //       console.log("Connection type", state.type)
  //       console.log("Is connected?", state.isConnected)
  //     })
  //   })

  //   test('能返回正确的关于网络状态的判断', done => {
  //     const networkType = 'none'
  //     const networkCb = (res) => {
  //       expect(res).toEqual({ networkType, isConnected: false })
  //       done()
  //     }
  //     expect.assertions(1)

  //     Taro.onNetworkStatusChange(networkCb)
  //     NetInfo.changeNetworkType('none')
  //   })
  // })
})
