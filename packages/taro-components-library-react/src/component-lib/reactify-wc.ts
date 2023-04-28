/**
 * https://github.com/BBKolton/reactify-wc/
 * modified event naming
 **/
import React, { createElement, createRef } from 'react'

const h = React.createElement

const SCROLL_VIEW = 'taro-scroll-view-core'

const IS_NON_DIMENSIONAL = /aspect|acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i

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

function updateStyle (dom, key, val) {
  if (/^--/.test(key)) {
    // css variable
    dom.style.setProperty(key, val)
  } else if (typeof val !== 'number' || IS_NON_DIMENSIONAL.test(key)) {
    dom.style[key] = val
  } else {
    dom.style[key] = val + 'px'
  }
}

function updateProp (ctx, comp, propKey, prevProps, props) {
  const dom = ctx.ref.current
  const val = props[propKey]
  const prevVal = prevProps ? prevProps[propKey] : undefined

  if (propKey === 'children') {
    return
  }
  if (propKey.toLowerCase() === 'classname') {
    dom.className = prevProps
      ? getClassName(dom, prevProps, props)
      : val
    return
  }
  if (propKey === 'style') {
    if (typeof val === 'string') {
      dom.setAttribute(propKey, val)
      return
    }
    if (!val) {
      dom.removeAttribute(propKey)
      return
    }

    if (prevProps) {
      if (typeof prevVal === 'string') {
        dom.style.cssText = ''
      } else {
        for (const styleKey in prevVal) {
          updateStyle(dom, styleKey, '')
        }
      }
    }

    for (const styleKey in val) {
      updateStyle(dom, styleKey, val[styleKey])
    }
    return
  }
  if (/^data-.+/.test(propKey)) {
    dom.setAttribute(propKey, val)
  }
  if (comp === SCROLL_VIEW) {
    if (propKey === 'scrollTop') {
      dom.mpScrollTop = val
      return
    }
    if (propKey === 'scrollLeft') {
      dom.mpScrollLeft = val
      return
    }
    if (propKey === 'scrollIntoView') {
      dom.mpScrollIntoView = val
      return
    }
  }
  if (typeof val === 'function' && propKey.match(/^on[A-Z]/)) {
    const event = propKey.substr(2).toLowerCase()

    ctx.eventHandlers.push([event, val])
    return dom.addEventListener(event, val)
  }

  if (typeof val === 'string' || typeof val === 'number') {
    dom.setAttribute(propKey, val)
    dom[propKey] = val
    return
  }
  if (typeof val === 'boolean') {
    if (val) {
      dom[propKey] = true
      return dom.setAttribute(
        propKey,
        val
      )
    }
    dom[propKey] = false
    return dom.removeAttribute(propKey)
  }
  dom[propKey] = val
}

const reactifyWebComponent = WC => {
  class Index extends React.Component<Record<string, any>> {
    eventHandlers: any[]
    ref: React.RefObject<HTMLElement>

    constructor (props) {
      super(props)
      this.eventHandlers = []
      this.ref = createRef()
    }

    update (prevProps) {
      this.clearEventHandlers()
      if (!this.ref.current) return

      Object.keys(prevProps || {}).forEach((key) => {
        if (key !== 'children' && key !== 'key' && !(key in this.props)) {
          updateProp(this, WC, key, prevProps, this.props)
        }
      })

      Object.keys(this.props).forEach((key) => {
        updateProp(this, WC, key, prevProps, this.props)
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
      this.update(undefined)
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
      const props: Record<string, any> = {
        ref: this.ref
      }
      if (dangerouslySetInnerHTML) props.dangerouslySetInnerHTML = dangerouslySetInnerHTML
      return createElement(WC, props, children)
    }
  }

  // eslint-disable-next-line react/display-name
  return React.forwardRef((props, ref) => (
    h(Index, { ...props, forwardRef: ref })
  ))
}

export default reactifyWebComponent
