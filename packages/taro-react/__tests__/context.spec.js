/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
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
