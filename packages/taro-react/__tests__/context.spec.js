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

import * as React from 'react'
let document
let render

describe('Context', () => {
  beforeAll(() => {
    process.env.FRAMEWORK = 'react'
    render = require('../dist/index').render
    document = require('@tarojs/runtime').document
  })

  afterAll(() => {
    process.env.FRAMEWORK = undefined
  })

  it('Context must be available in the consumer', () => {
    let actual = 0
    const Context = React.createContext()

    function Consumer () {
      return (
        <Context.Consumer>
          {value => {
            actual = value
            return <text prop={'Result: ' + value} />
          }}
        </Context.Consumer>
      )
    }

    class MyNode extends React.Component {
      render () {
        return (
          <view>
            <text>Noise</text>
            <Consumer />
          </view>
        )
      }
    }

    const container = document.createElement('view')
    render(
      <Context.Provider value={5}>
        <MyNode />
      </Context.Provider>,
      container,
      function () {
        expect(actual).toBe(5)
      }
    )
  })
})
