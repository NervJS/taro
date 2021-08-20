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

// eslint-disable-next-line no-use-before-define
import React from 'react'
import { renderIntoDocument } from 'nerv-test-utils'
import Video from '../index'

describe('Video', () => {
  const videoOpts = {
    src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    controls: true,
    autoplay: false,
    poster: 'http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg',
    initialTime: 30,
    id: 'video',
    loop: false,
    muted: false
  }

  it('render Video', () => {
    const component = renderIntoDocument(
      <Video {...videoOpts} />)
    expect(component.props.autoplay).toBeFalsy()
    expect(component.props.controls).toBeTruthy()
    expect(component.props.loop).toBeFalsy()
    expect(component.props.muted).toBeFalsy()
  })
})
