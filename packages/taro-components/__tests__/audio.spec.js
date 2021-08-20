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

import React from 'react'
import { Audio } from '../h5/react'
import { mount } from './test-tools'
import * as assert from 'assert'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Audio', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('props', async () => {
    const src = 'http://storage.jd.com/cjj-pub-images/horse.ogv'
    const controls = true
    const loop = true

    class App extends React.Component {
      constructor () {
        super(...arguments)
        this.state = {
          src,
          controls,
          loop
        }
      }

      render () {
        const {
          src,
          controls,
          loop
        } = this.state
        return (
          <Audio src={src} controls={controls} loop={loop} />
        )
      }
    }

    const wrapper = await mount(<App />, scratch)
    const audio = wrapper.node.firstElementChild

    assert(audio instanceof HTMLAudioElement)
    assert(audio.src === src)
    assert(audio.controls === controls)
    assert(audio.loop === loop)

    await wrapper.setState({
      controls: false,
      loop: false
    })

    assert(audio.controls === false)
    assert(audio.loop === false)
  })
})
