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
import { shallow } from 'enzyme'
import MovableArea from '../src/components/MovableArea'

describe('MovableArea', () => {
  it('MovableArea default props', () => {
    const wrapper = shallow(<MovableArea
      animation
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
    >content</MovableArea>)
    const view = wrapper.at(0)
    expect(view.props().style).toEqual([{ height: 100, overflow: 'hidden', width: 100 }, undefined])
  })

  it('MovableArea emit layout', () => {
    const wrapper = shallow(<MovableArea
      animation
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
    >content</MovableArea>)
    const view = wrapper.at(0)
    const event = {
      nativeEvent: {
        layout: {
          width: 200,
          height: 200,
        }
      }
    }
    view.simulate('layout', event)
    expect(wrapper.childAt(0).props().layout).toEqual({ width: 200, height: 200 })
    // expect(wrapper.childAt(0).text()).toContain('move me')
  })
})
