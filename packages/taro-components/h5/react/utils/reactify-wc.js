/**
 * https://github.com/BBKolton/reactify-wc/
 * modified event naming
 **/
import React, { createRef, createElement } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

const reactifyWebComponent = WC => {
  class Index extends React.Component {
    constructor (props) {
      super(props)
      this.eventHandlers = []
      this.ref = createRef()
    }

    update () {
      this.clearEventHandlers()
      Object.entries(this.props).forEach(([prop, val]) => {
        if (!this.ref.current) return
        if (prop === 'children') {
          return
        }
        if (prop.toLowerCase() === 'classname') {
          return (this.ref.current.className = val)
        }
        if (typeof val === 'function' && prop.match(/^on[A-Z]/)) {
          const event = prop.substr(2).toLowerCase()
          this.eventHandlers.push([event, val])
          return this.ref.current.addEventListener(event, val)
        }
        if (typeof val === 'function' && prop.match(/^on\-[a-z]/)) {
          const event = prop.substr(3)
          this.eventHandlers.push([event, val])
          return this.ref.current.addEventListener(event, val)
        }
        if (typeof val === 'string' || typeof val === 'number') {
          this.ref.current[prop] = val
          return this.ref.current.setAttribute(prop, val)
        }
        if (typeof val === 'boolean') {
          if (val) {
            this.ref.current[prop] = true
            return this.ref.current.setAttribute(
              prop,
              val
            )
          }
          delete this.ref.current[prop]
          return this.ref.current.removeAttribute(prop)
        }
        this.ref.current[prop] = val
      })
    }

    componentDidUpdate () {
      this.update()
    }

    componentDidMount () {
      const { forwardRef } = this.props
      if (typeof forwardRef === 'function') {
        forwardRef(this.ref.current)
      } else if (forwardRef && typeof forwardRef === 'object' && forwardRef.hasOwnProperty('current')) {
        forwardRef.current = this.ref.current
      } else if (typeof forwardRef === 'string') {
        console.warn('内置组件不支持字符串 ref')
      }
      this.update()
    }

    componentWillUnmount () {
      this.clearEventHandlers()
    }

    clearEventHandlers () {
      this.eventHandlers.forEach(([event, handler]) => {
        if (!this.ref.current) return
        this.ref.current.removeEventListener(event, handler)
      })
      this.eventHandlers = []
    }

    render () {
      const { children } = this.props
      return createElement(WC, { ref: this.ref }, children)
    }
  }
  return React.forwardRef((props, ref) => (
    <Index {...props} forwardRef={ref} />
  ))
}

export default reactifyWebComponent
