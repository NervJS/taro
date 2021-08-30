import {
  Current,
  document,
  injectPageInstance,
  safeExecute,
  addLeadingSlash,
  incrementId,
  eventHandler
} from '@tarojs/runtime'
import { isClassComponent } from './utils'
import { setReconciler } from './connect'

import type * as React from 'react'
import type { PageInstance } from '@tarojs/taro'
import type {
  TaroRootElement,
  Instance
} from '@tarojs/runtime'

declare const getCurrentPages: () => PageInstance[]

const getNativeCompId = incrementId()
let R: typeof React
let h: typeof React.createElement
let ReactDOM

function initNativeComponentEntry (R: typeof React, ReactDOM) {
  interface IEntryState {
    components: {
      compId: string
      element: React.ReactElement
    }[]
  }

  interface IWrapperProps {
    getCtx: () => any
    renderComponent: (ctx: any) => React.ReactElement
  }

  class NativeComponentWrapper extends R.Component<IWrapperProps, Record<any, any>> {
    root = R.createRef<TaroRootElement>()
    ctx = this.props.getCtx()

    componentDidMount () {
      this.ctx.component = this
      const rootElement = this.root.current!
      rootElement.ctx = this.ctx
      rootElement.performUpdate(true)
    }

    render () {
      return (
        h(
          'root',
          {
            ref: this.root
          },
          this.props.renderComponent(this.ctx)
        )
      )
    }
  }

  class Entry extends R.Component<Record<any, any>, IEntryState> {
    state: IEntryState = {
      components: []
    }

    componentDidMount () {
      Current.app = this
    }

    mount (Component, compId, getCtx) {
      const isReactComponent = isClassComponent(R, Component)
      const inject = (node?: Instance) => node && injectPageInstance(node, compId)
      const refs = isReactComponent ? { ref: inject } : {
        forwardedRef: inject,
        reactReduxForwardedRef: inject
      }
      const item = {
        compId,
        element: h(NativeComponentWrapper, {
          key: compId,
          getCtx,
          renderComponent (ctx) {
            return h(Component, { ...(ctx.data ||= {}).props, ...refs })
          }
        })
      }
      this.setState({
        components: [...this.state.components, item]
      })
    }

    unmount (compId) {
      const components = this.state.components
      const index = components.findIndex(item => item.compId === compId)
      const next = [...components.slice(0, index), ...components.slice(index + 1)]
      this.setState({
        components: next
      })
    }

    render () {
      const components = this.state.components
      return (
        components.map(({ element }) => element)
      )
    }
  }

  setReconciler()

  const app = document.getElementById('app')

  ReactDOM.render(
    h(Entry, {}),
    app
  )
}

export function createNativeComponentConfig (Component, react: typeof React, reactdom, componentConfig) {
  R = react
  h = react.createElement
  ReactDOM = reactdom

  setReconciler()

  const componentObj = {
    properties: {
      props: {
        type: null,
        value: null,
        observer (_newVal, oldVal) {
          oldVal && this.component.forceUpdate()
        }
      }
    },
    created () {
      if (!Current.app) {
        initNativeComponentEntry(R, ReactDOM)
      }
    },
    attached () {
      setCurrent()
      this.compId = getNativeCompId()
      this.config = componentConfig
      Current.app!.mount!(Component, this.compId, () => this)
    },
    ready () {
      safeExecute(this.compId, 'onReady')
    },
    detached () {
      Current.app!.unmount!(this.compId)
    },
    pageLifetimes: {
      show () {
        safeExecute(this.compId, 'onShow')
      },
      hide () {
        safeExecute(this.compId, 'onHide')
      }
    },
    methods: {
      eh: eventHandler
    }
  }

  function setCurrent () {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (Current.page === currentPage) return

    Current.page = currentPage

    const route = (currentPage as any).route || (currentPage as any).__route__
    const router = {
      params: currentPage.options || {},
      path: addLeadingSlash(route),
      onReady: '',
      onHide: '',
      onShow: ''
    }
    Current.router = router

    if (!currentPage.options) {
      // 例如在微信小程序中，页面 options 的设置时机比组件 attached 慢
      Object.defineProperty(currentPage, 'options', {
        enumerable: true,
        configurable: true,
        get () {
          return this._optionsValue
        },
        set (value) {
          router.params = value
          this._optionsValue = value
        }
      })
    }
  }

  return componentObj
}
