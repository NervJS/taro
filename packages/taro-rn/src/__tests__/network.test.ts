/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
