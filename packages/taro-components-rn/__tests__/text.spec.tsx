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
import { Text as ReactNativeText } from 'react-native'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'
import Text from '../src/components/Text'

describe('<Text />', () => {
  it('simple structure check', () => {
    const wrapper = shallow(<Text>Miao miao miao~</Text>)
    expect(wrapper.childAt(0).text()).toContain('Miao miao miao~')
  })

  it('onClick', () => {
    const spy = sinon.spy()
    const wrapper = shallow(<Text onClick={spy}>Test Text</Text>)
    // eslint-disable-next-line
    // @ts-ignore
    wrapper.find(ReactNativeText).props().onPress()
    expect(spy.calledOnce).toBe(true)
  })
})
