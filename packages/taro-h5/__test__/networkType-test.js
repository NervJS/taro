/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/* eslint-disable */
import * as Taro from '../src/api'

describe('networkType', () => {
  test('should getNetworkType return Promise that resolve networkType', () => {
    const success = jest.fn()
    const complete = jest.fn()

    navigator.connection = {
      effectiveType: '4g'
    }

    expect.assertions(3)
    return Taro.getNetworkType({
      success,
      complete
    })
      .then(res => {
        expect(success.mock.calls.length).toBe(1)
        expect(complete.mock.calls.length).toBe(1)
        expect(res.networkType).toBe('4g')
      })
  })

  test('should get networkType from connection.type', () => {
    navigator.connection = {
      type: 'wifi'
    }

    expect.assertions(1)
    return Taro.getNetworkType()
      .then(res => {
        expect(res.networkType).toBe('wifi')
      })
  })

  test('should get networkType from connection.type that does not follow the spec', () => {
    navigator.connection = {
      "type": "3",
      "UNKNOWN": "0",
      "ETHERNET": "1",
      "WIFI": "2",
      "CELL_2G": "3",
      "CELL_3G": "4"
    }

    expect.assertions(1)
    return Taro.getNetworkType()
      .then(res => {
        expect(res.networkType).toBe('2g')
      })
  })

  test('should get networkType from connection.type that does not follow the spec', done => {
    const cbList = {}
    navigator.connection = {
      effectiveType: '4g',
      addEventListener: jest.fn((ev, cb) => {
        cbList[ev] = cb
      })
    }

    setTimeout(() => cbList['change'](), 1000)

    Taro.onNetworkStatusChange(ev => {
      expect(ev.isConnected).toBe(true)
      expect(ev.networkType).toBe('4g')
      done()
    })
  })
})
