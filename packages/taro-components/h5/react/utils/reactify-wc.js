/**
 * https://github.com/BBKolton/reactify-wc/
 * modified event naming
 **/
import React, { createRef, createElement } from 'react'

// eslint-disable-next-line
const h = React.createElement

const SCROLL_VIEW = 'taro-scroll-view-core'

// 为了不要覆盖 wc 中 host 内置的 class 和 stencil 加入的 class
function getClassName (wc, prevProps, props) {
  const classList = Array.from(wc.classList)
  const oldClassNames = (prevProps.className || prevProps.class || '').split(' ')
  let incomingClassNames = (props.className || props.class || '').split(' ')
  let finalClassNames = []

  classList.forEach(classname => {
    if (incomingClassNames.indexOf(classname) > -1) {
      finalClassNames.push(classname)
      incomingClassNames = incomingClassNames.filter(name => name !== classname)
    } else if (oldClassNames.indexOf(classname) === -1) {
      finalClassNames.push(classname)
    }
  })

  finalClassNames = [...finalClassNames, ...incomingClassNames]

  return finalClassNames.join(' ')
}

const reactifyWebComponent = WC => {
  class Index extends React.Component {
    constructor (props) {
      super(props)
      this.eventHandlers = []
      this.ref = createRef()
    }

    update (prevProps) {
      this.clearEventHandlers()
      Object.entries(this.props).forEach(([prop, val]) => {
        if (!this.ref.current) return
        if (prop === 'children') {
          return
        }
        if (prop.toLowerCase() === 'classname') {
          this.ref.current.className = prevProps
            ? getClassName(this.ref.current, prevProps, this.props)
            : val
          return
        }
        if (prop === 'style') {
          if (typeof val === 'string') {
            return this.ref.current.setAttribute(prop, val)
          } else if (val && typeof val === 'object') {
            for (const key in val) {
              this.ref.current.style[key] = val[key]
            }
            return
          }
          return
        }
        if (WC === SCROLL_VIEW) {
          if (prop === 'scrollTop') {
            this.ref.current.mpScrollTop = val
            return
          }
          if (prop === 'scrollLeft') {
            this.ref.current.mpScrollLeft = val
            return
          }
          if (prop === 'scrollIntoView') {
            this.ref.current.mpScrollIntoView = val
            return
          }
        }
        if (typeof val === 'function' && prop.match(/^on[A-Z]/)) {
          const event = prop.substr(2).toLowerCase()
          let fn = val

          // 解决用户监听 ScrollView 的 onScroll 会监听到原生 onScroll 的问题
          if (WC === SCROLL_VIEW && event === 'scroll') {
            fn = function (e) {
              if (e instanceof CustomEvent) {
                val.apply(null, Array.from(arguments))
              }
            }
          }

          this.eventHandlers.push([event, fn])
          return this.ref.current.addEventListener(event, fn)
        }
        // if (typeof val === 'function' && prop.match(/^on-[a-z]/)) {
        //   const event = prop.substr(3)
        //   this.eventHandlers.push([event, val])
        //   return this.ref.current.addEventListener(event, val)
        // }
        if (typeof val === 'string' || typeof val === 'number') {
          this.ref.current[prop] = val
          return
        }
        if (typeof val === 'boolean') {
          if (val) {
            this.ref.current[prop] = true
            return this.ref.current.setAttribute(
              prop,
              val
            )
          }
          this.ref.current[prop] = false
          return this.ref.current.removeAttribute(prop)
        }
        this.ref.current[prop] = val
      })
    }

    componentDidUpdate (prevProps) {
      this.update(prevProps)
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
      const { children, dangerouslySetInnerHTML } = this.props
      const props = {
        ref: this.ref
      }
      if (dangerouslySetInnerHTML) props.dangerouslySetInnerHTML = dangerouslySetInnerHTML
      return createElement(WC, props, children)
    }
  }
  return React.forwardRef((props, ref) => (
    React.createElement(Index, { ...props, forwardRef: ref })
  ))
}

export default reactifyWebComponent
