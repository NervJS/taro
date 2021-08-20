/*!
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

// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { TextInput } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
// import { Input } from '../src'
import Input from '../src/components/Input'

describe('<Input /> & <Textarea>', () => {
  describe('events', () => {
    it('onKeyDown', () => {
      const spy = sinon.spy()
      const wrapper = shallow(<Input onKeyDown={spy} />)
      // eslint-disable-next-line
      // @ts-ignore
      wrapper.find(TextInput).props().onKeyPress({ nativeEvent: { key: 'Enter' } } as any)
      expect(spy.calledOnce).toBe(true)
      expect(spy.args[0][0]).toMatchObject({
        which: 13,
        target: expect.objectContaining({
          value: expect.any(String)
        })
      })
    })
  })

  describe('prop value changed', () => {
    it('should be new value', () => {
      const wrapper = shallow(<Input value={'default text'} />)
      // expect(wrapper.state('returnValue')).toBe('default text')
      wrapper.setProps({ value: 'new text' })
      expect(wrapper.state('returnValue')).toBe('new text')
    })
  })
})
