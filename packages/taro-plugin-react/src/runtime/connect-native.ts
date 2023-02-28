import {
  addLeadingSlash, Current, document, eventHandler,
  incrementId, injectPageInstance, Instance, removePageInstance, safeExecute,
  TaroRootElement
} from '@tarojs/runtime'
import { EMPTY_OBJ } from '@tarojs/shared'

import { setReconciler } from './connect'
import { reactMeta } from './react-meta'
import { isClassComponent } from './utils'

import type { PageInstance } from '@tarojs/taro'
import type * as React from 'react'

declare const getCurrentPages: () => PageInstance[]

const getNativeCompId = incrementId()
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
      if (reactMeta.PageContext === EMPTY_OBJ) {
        reactMeta.PageContext = R.createContext('')
      }
      const item = {
        compId,
        element: h(NativeComponentWrapper, {
          key: compId,
          getCtx,
          renderComponent (ctx) {
            return h(
              reactMeta.PageContext.Provider,
              { value: compId },
              h(
                Component,
                {
                  ...(ctx.data ||= {}).props,
                  ...refs,
                  $scope: ctx
                }
              )
            )
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
      }, () => {
        removePageInstance(compId)
      })
    }

    render () {
      const components = this.state.components
      return (
        components.map(({ element }) => element)
      )
    }
  }

  setReconciler(ReactDOM)

  const app = document.getElementById('app')

  ReactDOM.render(
    h(Entry, {}),
    app
  )
}

export function createNativeComponentConfig (Component, react: typeof React, reactdom, componentConfig) {
  reactMeta.R = react
  h = react.createElement
  ReactDOM = reactdom

  setReconciler(ReactDOM)

  const componentObj: Record<string, any> = {
    options: componentConfig,
    properties: {
      props: {
        type: null,
        value: null,
        observer (_newVal, oldVal) {
          oldVal && this.component?.forceUpdate()
        }
      }
    },
    created () {
      if (!Current.app) {
        initNativeComponentEntry(react, ReactDOM)
      }
    },
    attached () {
      const compId = this.compId = getNativeCompId()
      setCurrent(compId)
      this.config = componentConfig
      Current.app!.mount!(Component, compId, () => this)
    },
    ready () {
      safeExecute(this.compId, 'onReady')
    },
    detached () {
      resetCurrent()
      Current.app!.unmount!(this.compId)
    },
    pageLifetimes: {
      show (options) {
        safeExecute(this.compId, 'onShow', options)
      },
      hide () {
        safeExecute(this.compId, 'onHide')
      }
    },
    methods: {
      eh: eventHandler,
      onLoad (options) {
        safeExecute(this.compId, 'onLoad', options)
      },
      onUnload () {
        safeExecute(this.compId, 'onUnload')
      }
    }
  }
  
  function resetCurrent () {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    Current.page = null
    Current.router = null
  }

  function setCurrent (compId: string) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (Current.page === currentPage) return

    Current.page = currentPage

    const route = (currentPage as any).route || (currentPage as any).__route__
    const router = {
      params: currentPage.options || {},
      path: addLeadingSlash(route),
      $taroPath: compId,
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

  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  if (
    Component.onShareAppMessage ||
    Component.prototype?.onShareAppMessage ||
    Component.enableShareAppMessage
  ) {
    componentObj.methods.onShareAppMessage = function (options) {
      const target = options?.target
      if (target) {
        const id = target.id
        const element = document.getElementById(id)
        if (element) {
          target!.dataset = element.dataset
        }
      }
      return safeExecute(this.compId, 'onShareAppMessage', options)
    }
  }
  if (
    Component.onShareTimeline ||
    Component.prototype?.onShareTimeline ||
    Component.enableShareTimeline
  ) {
    componentObj.methods.onShareTimeline = function () {
      return safeExecute(this.compId, 'onShareTimeline')
    }
  }

  return componentObj
}
