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
import ReactDOM from 'react-dom'
import {
  CoverImage,
  CoverView,
  MovableArea,
  MovableView,
  PickerView,
  PickerViewColumn,
  OpenData,
  Camera
} from '../h5/react'
import * as assert from 'assert'
import * as sinon from 'sinon'
import { waitForChange } from './utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('unimplemented', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  let warning = ''

  function toCamelCase (s) {
    let camel = ''
    let nextCap = false
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== '-') {
        camel += nextCap ? s[i].toUpperCase() : s[i]
        nextCap = false
      } else {
        nextCap = true
      }
    }
    return camel
  }

  function capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function buildWarning (ref) {
    return `H5 暂不支持 ${capitalize(toCamelCase(ref.current.nodeName.slice(5).replace('-CORE', '').toLowerCase()))} 组件！`
  }

  async function testComponent (Comp) {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <Comp ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  }

  beforeAll(() => {
    sinon.stub(console, 'error').callsFake(msg => {
      warning = msg
    })
  })

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  afterAll(() => {
    console.error.restore()
  })

  it('CoverView', async () => {
    await testComponent(CoverView)
  })

  it('CoverImage', async () => {
    await testComponent(CoverImage)
  })

  it('MovableArea', async () => {
    await testComponent(MovableArea)
  })

  it('MovableView', async () => {
    await testComponent(MovableView)
  })

  it('PickerViewColumn', async () => {
    await testComponent(PickerViewColumn)
  })

  it('PickerView', async () => {
    await testComponent(PickerView)
  })

  it('OpenData', async () => {
    await testComponent(OpenData)
  })

  it('Camera', async () => {
    await testComponent(Camera)
  })
})
