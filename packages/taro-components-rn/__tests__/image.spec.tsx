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
import * as sinon from 'sinon'
import ClickableImage, { _Image } from '../src/components/Image'

describe('<Image />', () => {
  it('should Image have src attribute', () => {
    const src = 'https://alo'
    const wrapper = shallow(<ClickableImage src={src} />)
    const wrapperImage = wrapper.find(_Image)
    expect(wrapperImage).not.toBeUndefined()
    expect(wrapperImage.props().src).toBe(src)
  })

  it('simulates onError events', () => {
    const onError = sinon.spy()
    const wrapper = shallow(
      <ClickableImage
        src='https://alo'
        onError={onError}
      />
    )
    const wrapperImage = wrapper.find(_Image)
    // eslint-disable-next-line
    // @ts-ignore
    wrapperImage.props().onError()
    expect(onError.callCount).toBe(1)
  })

  it('simulates onLoad events', () => {
    const onLoad = sinon.spy()
    const wrapper = shallow(
      <ClickableImage
        src='https://placehold.it/1x1'
        onLoad={onLoad}
      />
    )
    const wrapperImage = wrapper.find(_Image)
    // eslint-disable-next-line
    // @ts-ignore
    wrapperImage.props().onLoad()
    expect(onLoad.callCount).toBe(1)
  })

  it('simulates onLoad events of local image', () => {
    const onLoad = sinon.spy()
    const wrapper = shallow(
      <ClickableImage
        src={require('./1x1.png')}
        onLoad={onLoad}
      />
    )
    const wrapperImage = wrapper.find(_Image)
    // eslint-disable-next-line
    // @ts-ignore
    wrapperImage.props().onLoad()
    expect(onLoad.callCount).toBe(1)
  })
})
