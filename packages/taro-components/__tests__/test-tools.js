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

        await waitForChange(this.ref.current)
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
