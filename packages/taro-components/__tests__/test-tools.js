import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMClient from 'react-dom/client'

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

    ReactDOMClient.createRoot(wrapper).render(<App />)
  })
}
