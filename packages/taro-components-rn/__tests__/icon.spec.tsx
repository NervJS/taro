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
import { View, Image, Platform } from 'react-native'
import { shallow } from 'enzyme'
import Icon from '../src/components/Icon'

describe('<Icon />', () => {
  describe('ios & android', () => {
    Platform.OS = 'ios'

    const TestedIcon = (<Icon type='success' size={50} />)

    it('simple structure check', () => {
      const wrapper = shallow(TestedIcon)
      const foundView = wrapper.find(View)
      const firstViewNode = foundView.get(0)
      expect(foundView).toHaveProperty('length', 1)
      expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'width'], 50)
      expect(firstViewNode).toHaveProperty(['props', 'style', 1, 'height'], 50)
    })

    it('specific color', () => {
      const wrapper = shallow(<Icon type="success" color="red" />)
      expect(wrapper.find(Image).get(0)).toHaveProperty(['props', 'style', 'tintColor'], 'red')
    })

    it('invalid prop value check', () => {
      // eslint-disable-next-line
      // @ts-ignore
      const wrapperOfType = shallow(<Icon type='miao' />)
      expect(wrapperOfType.find(View)).toHaveProperty('length', 1)
      // expect(() => shallow(<Icon type='success' size={'miao'} />)).toThrow()
    })
  })
})
