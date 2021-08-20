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

/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render } from 'nervjs'
import withWeapp from '../src'
import { TaroComponent, delay } from './utils'

describe('lifecycle', () => {
  /**
   * @type {Element} scratch
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  test('state can destruct from this', (done) => {
    @withWeapp({
      data: {
        a: 'a'
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('a')
      done()
    })
  })

  test('state can be changed by this.setData', (done) => {
    @withWeapp({
      data: {
        a: ''
      },
      ready () {
        this.setData({
          a: 'b'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })

  test('state can be changed by this.setData path', (done) => {
    @withWeapp({
      data: {
        a: {
          b: ''
        }
      },
      ready () {
        this.setData({
          'a.b': 'b'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a.b}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })

  test('state can be changed even not init data is provided', (done) => {
    @withWeapp({
      data: {
      },
      ready () {
        this.setData({
          a: 'b'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })
})
