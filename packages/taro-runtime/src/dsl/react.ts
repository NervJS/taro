import type * as React from 'react'
import { isFunction, ensure, EMPTY_OBJ } from '@tarojs/shared'
import container from '../container'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { Current } from '../current'
import { document } from '../bom/document'
import { getPageInstance, injectPageInstance, safeExecute, addLeadingSlash } from './common'
import { isBrowser } from '../env'
import { incrementId } from '../utils'
import { HOOKS_APP_ID } from '../constants'
import { eventHandler } from '../dom/event'

import type { AppConfig, PageInstance } from '@tarojs/taro'
import type { AppInstance, ReactPageComponent, PageProps, Instance, ReactAppInstance } from './instance'
import type { IHooks } from '../interface'
import type { TaroRootElement } from '../dom/root'

declare const getCurrentPages: () => PageInstance[]
const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

function isClassComponent (R: typeof React, component): boolean {
  return isFunction(component.render) ||
  !!component.prototype?.isReactComponent ||
  component.prototype instanceof R.Component // compat for some others react-like library
}

// 初始值设置为 any 主要是为了过 TS 的校验
export let R: typeof React = EMPTY_OBJ
export let PageContext: React.Context<string> = EMPTY_OBJ

export function connectReactPage (
  R: typeof React,
  id: string
) {
  const h = R.createElement
  return (component: ReactPageComponent): React.ComponentClass<PageProps> => {
    // eslint-disable-next-line dot-notation
    const isReactComponent = isClassComponent(R, component)

    const inject = (node?: Instance) => node && injectPageInstance(node, id)
    const refs = isReactComponent ? { ref: inject } : {
      forwardedRef: inject,
      // 兼容 react-redux 7.20.1+
      reactReduxForwardedRef: inject
    }

    if (PageContext === EMPTY_OBJ) {
      PageContext = R.createContext('')
    }

    return class Page extends R.Component<PageProps, { hasError: boolean }> {
      state = {
        hasError: false
      }

      static getDerivedStateFromError (error: Error) {
        process.env.NODE_ENV !== 'production' && console.warn(error)
        return { hasError: true }
      }

      // React 16 uncaught error 会导致整个应用 crash，
      // 目前把错误缩小到页面
      componentDidCatch (error: Error, info: React.ErrorInfo) {
        process.env.NODE_ENV !== 'production' && console.warn(error)
        process.env.NODE_ENV !== 'production' && console.error(info.componentStack)
      }

      render () {
        const children = this.state.hasError
          ? []
          : h(PageContext.Provider, { value: id }, h(component, {
            ...this.props,
            ...refs
          }))

        if (isBrowser) {
          return h(
            'div',
            { id, className: 'taro_page' },
            children
          )
        }

        return h(
          'root',
          { id },
          children
        )
      }
    }
  }
}

let ReactDOM

type PageComponent = React.CElement<PageProps, React.Component<PageProps, any, any>>

function setReconciler () {
  const getLifecycle = function (instance, lifecycle) {
    lifecycle = lifecycle.replace(/^on(Show|Hide)$/, 'componentDid$1')
    return instance[lifecycle]
  }

  const modifyMpEvent = function (event) {
    event.type = event.type.replace(/-/g, '')
  }

  const batchedEventUpdates = function (cb) {
    ReactDOM.unstable_batchedUpdates(cb)
  }

  const mergePageInstance = function (prev, next) {
    if (!prev || !next) return

    // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。

    // prev 使用 Object.create(null) 创建，H5 的 fast-refresh 可能也会导致存在 prev，要排除这些意外产生的 prev
    if ('constructor' in prev) return

    Object.keys(prev).forEach(item => {
      if (isFunction(next[item])) {
        next[item] = [next[item], ...prev[item]]
      } else {
        next[item] = [...(next[item] || []), ...prev[item]]
      }
    })
  }

  hooks.getLifecycle = getLifecycle
  hooks.modifyMpEvent = modifyMpEvent
  hooks.batchedEventUpdates = batchedEventUpdates
  hooks.mergePageInstance = mergePageInstance

  if (process.env.TARO_ENV === 'h5') {
    hooks.createPullDownComponent = (
      el: React.FunctionComponent<PageProps> | React.ComponentClass<PageProps>,
      _,
      R: typeof React,
      customWrapper
    ) => {
      const isReactComponent = isClassComponent(R, el)

      return R.forwardRef((props, ref) => {
        const newProps: React.Props<any> = { ...props }
        const refs = isReactComponent ? { ref: ref } : {
          forwardedRef: ref,
          // 兼容 react-redux 7.20.1+
          reactReduxForwardedRef: ref
        }

        return R.createElement(
          customWrapper || 'taro-pull-to-refresh',
          null,
          R.createElement(el, {
            ...newProps,
            ...refs
          })
        )
      })
    }

    hooks.getDOMNode = (inst) => {
      return ReactDOM.findDOMNode(inst)
    }
  }
}

const pageKeyId = incrementId()

export function createReactApp (App: React.ComponentClass, react: typeof React, reactdom, config: AppConfig) {
  R = react
  ReactDOM = reactdom
  ensure(!!ReactDOM, '构建 React/Nerv 项目请把 process.env.FRAMEWORK 设置为 \'react\'/\'nerv\' ')

  const ref = R.createRef<ReactAppInstance>()
  const isReactComponent = isClassComponent(R, App)

  setReconciler()

  let wrapper: AppWrapper

  class AppWrapper extends R.Component {
    // run createElement() inside the render function to make sure that owner is right
    private pages: Array<() => PageComponent> = []
    private elements: Array<PageComponent> = []

    public mount (component: React.ComponentClass<PageProps>, id: string, cb: () => void) {
      const key = id + pageKeyId()
      const page = () => R.createElement(component, { key, tid: id })
      this.pages.push(page)
      this.forceUpdate(cb)
    }

    public unmount (id: string, cb: () => void) {
      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i]
        if (element.props.tid === id) {
          this.elements.splice(i, 1)
          break
        }
      }

      this.forceUpdate(cb)
    }

    public render () {
      while (this.pages.length > 0) {
        const page = this.pages.pop()!
        this.elements.push(page())
      }

      let props: React.Props<any> | null = null

      if (isReactComponent) {
        props = { ref }
      }

      return R.createElement(
        App,
        props,
        isBrowser ? R.createElement('div', null, this.elements.slice()) : this.elements.slice()
      )
    }
  }

  const app: AppInstance = Object.create({
    render (cb: () => void) {
      wrapper.forceUpdate(cb)
    },

    mount (component: ReactPageComponent, id: string, cb: () => void) {
      const page = connectReactPage(R, id)(component)
      wrapper.mount(page, id, cb)
    },

    unmount (id: string, cb: () => void) {
      wrapper.unmount(id, cb)
    }
  }, {
    config: {
      writable: true,
      enumerable: true,
      configurable: true,
      value: config
    },

    onLaunch: {
      enumerable: true,
      writable: true,
      value (options) {
        Current.router = {
          params: options?.query,
          ...options
        }
        // eslint-disable-next-line react/no-render-return-value
        wrapper = ReactDOM.render(R.createElement(AppWrapper), document.getElementById('app'))
        const app = ref.current

        // For taroize
        // 把 App Class 上挂载的额外属性同步到全局 app 对象中
        if (app?.taroGlobalData) {
          const globalData = app.taroGlobalData
          const keys = Object.keys(globalData)
          const descriptors = Object.getOwnPropertyDescriptors(globalData)
          keys.forEach(key => {
            Object.defineProperty(this, key, {
              configurable: true,
              enumerable: true,
              get () {
                return globalData[key]
              },
              set (value) {
                globalData[key] = value
              }
            })
          })
          Object.defineProperties(this, descriptors)
        }
        this.$app = app

        if (app != null && isFunction(app.onLaunch)) {
          app.onLaunch(options)
        }
      }
    },

    onShow: {
      enumerable: true,
      writable: true,
      value (options) {
        const app = ref.current
        Current.router = {
          params: options?.query,
          ...options
        }
        if (app != null && isFunction(app.componentDidShow)) {
          app.componentDidShow(options)
        }

        // app useDidShow
        triggerAppHook('onShow')
      }
    },

    onHide: {
      enumerable: true,
      writable: true,
      value (options: unknown) {
        const app = ref.current
        if (app != null && isFunction(app.componentDidHide)) {
          app.componentDidHide(options)
        }

        // app useDidHide
        triggerAppHook('onHide')
      }
    },

    onPageNotFound: {
      enumerable: true,
      writable: true,
      value (res: unknown) {
        const app = ref.current
        if (app != null && isFunction(app.onPageNotFound)) {
          app.onPageNotFound(res)
        }
      }
    }
  })

  function triggerAppHook (lifecycle) {
    const instance = getPageInstance(HOOKS_APP_ID)
    if (instance) {
      const app = ref.current
      const func = hooks.getLifecycle(instance, lifecycle)
      if (Array.isArray(func)) {
        func.forEach(cb => cb.apply(app))
      }
    }
  }

  Current.app = app
  return Current.app
}

const getNativeCompId = incrementId()

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
        R.createElement(
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
        element: R.createElement(NativeComponentWrapper, {
          key: compId,
          getCtx,
          renderComponent (ctx) {
            return R.createElement(Component, { ...(ctx.data ||= {}).props, ...refs })
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
    R.createElement(Entry, {}),
    app
  )
}

export function createNativeComponentConfig (Component, react: typeof React, reactdom, componentConfig) {
  R = react
  ReactDOM = reactdom

  const config = {
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

  return config
}
