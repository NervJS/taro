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
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

export async function mount (node, wrapper) {
  return new Promise(resolve => {
    class App extends React.Component {
      constructor () {
        super(...arguments)
        const { type, props } = node
        this.ref = React.createRef()
        this.state = {
          Component: type,
          props
        }
      }

      async componentDidMount () {
        const ref = this.ref.current
        const dom = ref instanceof HTMLElement ? ref : ReactDOM.findDOMNode(ref)
        const { ref: forwardRef } = node
        if (typeof forwardRef === 'function') {
          forwardRef(ref)
        } else if (forwardRef && typeof forwardRef === 'object' && forwardRef.hasOwnProperty('current')) {
          forwardRef.current = ref
        } else if (typeof forwardRef === 'string') {
          console.warn('内置组件不支持字符串 ref')
        }

        await waitForChange(dom)

        resolve({
          node: dom,
          setState: this.setCompState,
          setProps: this.setProps,
          find: this.find,
          findAll: this.findAll
        })
      }

      setCompState = async (nextState) => {
        this.ref.current.setState(nextState)
        await waitForChange(ReactDOM.findDOMNode(this.ref.current))
      }

      setProps = async (nextProps) => {
        this.setState(prev => ({
          props: {
            ...prev.props,
            ...nextProps
          }
        }))

        await waitForChange(ReactDOM.findDOMNode(this.ref.current))
      }

      find = (selector) => {
        return this.ref.current.querySelector(selector)
      }

      findAll = (selector) => {
        return this.ref.current.querySelectorAll(selector)
      }

      render () {
        const { Component, props } = this.state
        return <Component ref={this.ref} {...props} />
      }
    }

    ReactDOM.render(<App />, wrapper)
  })
}
