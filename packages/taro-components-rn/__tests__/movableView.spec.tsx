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
import toJson from 'enzyme-to-json'
import MovableView from '../src/components/MovableView'

describe('MovableView', () => {
  it('MovableView render', () => {
    const wrapper = shallow(<MovableView
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
      layout={{
        width: 100,
        height: 100,
      }}
    />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
