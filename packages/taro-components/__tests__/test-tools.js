import React from 'react'
import ReactDOM from 'react-dom'
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

export async function mount (node, wrapper) {
  const app = React.createRef()
  const ref = React.createRef()

  class App extends React.Component {
    constructor () {
      super(...arguments)
      const { type, props } = node
      this.state = {
        Component: type,
        props
      }
    }

    setProps = async (nextProps) => {
      this.setState(prev => ({
        props: {
          ...prev.props,
          ...nextProps
        }
      }))

      await waitForChange(ref.current)
      return Promise.resolve()
    }

    find = (selector) => {
      return ref.current.querySelector(selector)
    }

    findAll = (selector) => {
      return ref.current.querySelectorAll(selector)
    }

    render () {
      const { Component, props } = this.state
      return <Component ref={ref} {...props} />
    }
  }

  ReactDOM.render(<App ref={app} />, wrapper)

  await waitForChange(ref.current)

  return Promise.resolve({
    node: ref.current,
    setProps: app.current.setProps,
    find: app.current.find,
    findAll: app.current.findAll
  })
}
