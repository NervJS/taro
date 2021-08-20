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

import * as phone from '../lib/makePhoneCall'

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
