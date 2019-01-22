import { NetInfo } from 'react-native'
import MockNetInfo from './__mock__/mockNetwork'
import network from '../api/device/network'

const Taro = Object.assign({}, network)

describe('network', () => {
  beforeEach(() => {
    const NetInfo = new MockNetInfo('wifi')
    jest.setMock('NetInfo', NetInfo)
  })

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
        expect(success.mock.calls.length).toBe(1)
        expect(success.mock.calls[0][0]).toEqual({ networkType })
        expect(fail.mock.calls.length).toBe(0)
        expect(complete.mock.calls.length).toBe(1)
        expect(complete.mock.calls[0][0]).toEqual({ networkType })
        expect(res.networkType).toEqual(networkType)
      })
    })
  })

  describe('onNetworkStatusChange', () => {
    test('能够正常监听网络状态的变化', done => {
      const networkType = '3g'
      const networkCb = (res) => {
        expect(res).toEqual({ networkType, isConnected: true })
        done()
      }
      expect.assertions(1)

      Taro.onNetworkStatusChange(networkCb)
      NetInfo.changeNetworkType('cellular', networkType)
    })

    test('能返回正确的关于网络状态的判断', done => {
      const networkType = 'none'
      const networkCb = (res) => {
        expect(res).toEqual({ networkType, isConnected: false })
        done()
      }
      expect.assertions(1)

      Taro.onNetworkStatusChange(networkCb)
      NetInfo.changeNetworkType('none')
    })
  })
})
