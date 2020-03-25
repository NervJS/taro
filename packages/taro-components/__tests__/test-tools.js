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
        await waitForChange(this.ref.current)

        resolve({
          node: this.ref.current,
          setProps: this.setProps,
          find: this.find,
          findAll: this.findAll
        })
      }

      setProps = async (nextProps) => {
        this.setState(prev => ({
          props: {
            ...prev.props,
            ...nextProps
          }
        }))

        await waitForChange(this.ref.current)
        return Promise.resolve()
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
