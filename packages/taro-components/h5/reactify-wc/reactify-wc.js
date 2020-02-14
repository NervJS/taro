/**
 * https://github.com/BBKolton/reactify-wc/
 * modified event naming
 **/
import { RefObject, Component, createRef, createElement } from "react"

const reactifyWebComponent = (WC) => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.eventHandlers = []
      this.ref = createRef()
    }

    update() {
      this.clearEventHandlers()
      Object.entries(this.props).forEach(([prop, val]) => {
        if (!this.ref.current) return
        if (prop === "children") {
          return
        }
        if (prop.toLowerCase() === "classname") {
          return (this.ref.current.className = val)
        }
        if (typeof val === "function" && prop.match(/^on[A-Z]/)) {
          const event = prop.substr(2).toLowerCase()
          this.eventHandlers.push([event, val])
          return this.ref.current.addEventListener(event, val)
        }
        if (typeof val === "function" && prop.match(/^on\-[a-z]/)) {
          const event = prop.substr(3)
          this.eventHandlers.push([event, val])
          return this.ref.current.addEventListener(event, val)
        }
        if (typeof val === "string" || typeof val === "number") {
          this.ref.current[prop] = val
          return this.ref.current.setAttribute(prop, val)
        }
        if (typeof val === "boolean") {
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
        return
      })
    }

    componentDidUpdate() {
      this.update()
    }

    componentDidMount() {
      this.update()
    }

    componentWillUnmount() {
      this.clearEventHandlers()
    }

    clearEventHandlers() {
      this.eventHandlers.forEach(([event, handler]) => {
        if (!this.ref.current) return
        this.ref.current.removeEventListener(event, handler)
      })
      this.eventHandlers = []
    }

    render() {
      const { children } = this.props
      return createElement(WC, { ref: this.ref }, children)
    }
  }
}

export default reactifyWebComponent
