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
import { Block } from '../h5/react'
import { waitForChange } from './utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Block', () => {
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

  it('有一个空的占位元素，并且 slot 能够使用', async () => {
    const ref = React.createRef()

    class App extends React.Component {
      render () {
        return <Block ref={ref}>
          <div />
          <div />
        </Block>
      }
    }

    ReactDOM.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    expect(scratch.childNodes.length).toBe(1)
    expect(node.childNodes.length).toBe(2)
  })
})
