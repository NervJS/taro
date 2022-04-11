import { ensure, EMPTY_OBJ } from '@tarojs/shared'
import {
  container,
  SERVICE_IDENTIFIER,
  Current,
  document,
  getPageInstance,
  injectPageInstance,
  incrementId
} from '@tarojs/runtime'
import { isClassComponent, ensureIsArray, setDefaultDescriptor, setRouterParams, HOOKS_APP_ID } from './utils'
import { reactMeta } from './react-meta'

import type * as React from 'react'
import type { AppConfig } from '@tarojs/taro'
import type {
  IHooks,
  AppInstance,
  Instance,
  ReactAppInstance,
  ReactPageComponent,
  PageProps
} from '@tarojs/runtime'

type PageComponent = React.CElement<PageProps, React.Component<PageProps, any, any>>
declare const __TARO_FRAMEWORK_REACT_MODE__: string

let h: typeof React.createElement
let ReactDOM

const pageKeyId = incrementId()
const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

export function setReconciler (ReactDOM) {
  hooks.getLifecycle = function (instance, lifecycle: string) {
    lifecycle = lifecycle.replace(/^on(Show|Hide)$/, 'componentDid$1')
    return instance[lifecycle]
  }

  hooks.modifyMpEventImpls?.push(function (event) {
    event.type = event.type.replace(/-/g, '')
  })

  hooks.batchedEventUpdates = function (cb) {
    ReactDOM.unstable_batchedUpdates(cb)
  }

  hooks.mergePageInstance = function (prev, next) {
    if (!prev || !next) return

    // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。

    // prev 使用 Object.create(null) 创建，H5 的 fast-refresh 可能也会导致存在 prev，要排除这些意外产生的 prev
    if ('constructor' in prev) return

    Object.keys(prev).forEach(item => {
      const prevList = prev[item]
      const nextList = ensureIsArray<() => any>(next[item])
      next[item] = nextList.concat(prevList)
    })
  }

  if (process.env.TARO_ENV === 'h5') {
    hooks.createPullDownComponent = (
      el: React.FunctionComponent<PageProps> | React.ComponentClass<PageProps>,
      _,
      R: typeof React,
      customWrapper
    ) => {
      const isReactComponent = isClassComponent(R, el)

      return R.forwardRef((props, ref) => {
        const newProps: React.ComponentProps<any> = { ...props }
        const refs = isReactComponent ? { ref: ref } : {
          forwardedRef: ref,
          // 兼容 react-redux 7.20.1+
          reactReduxForwardedRef: ref
        }

        return h(
          customWrapper || 'taro-pull-to-refresh',
          null,
          h(el, {
            ...newProps,
            ...refs
          })
        )
      })
    }

    hooks.getDOMNode = inst => {
      return ReactDOM.findDOMNode(inst)
    }
  }
}

export function connectReactPage (
  R: typeof React,
  id: string
) {
  return (Page: ReactPageComponent): React.ComponentClass<PageProps> => {
    // eslint-disable-next-line dot-notation
    const isReactComponent = isClassComponent(R, Page)
    const inject = (node?: Instance) => node && injectPageInstance(node, id)
    const refs = isReactComponent ? { ref: inject } : {
      forwardedRef: inject,
      // 兼容 react-redux 7.20.1+
      reactReduxForwardedRef: inject
    }

    if (reactMeta.PageContext === EMPTY_OBJ) {
      reactMeta.PageContext = R.createContext('')
    }

    return class PageWrapper extends R.Component<PageProps, { hasError: boolean }> {
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
        if (process.env.NODE_ENV !== 'production') {
          console.warn(error)
          console.error(info.componentStack)
        }
      }

      render () {
        const children = this.state.hasError
          ? []
          : h(reactMeta.PageContext.Provider, { value: id }, h(Page, {
            ...this.props,
            ...refs
          }))

        if (process.env.TARO_ENV === 'h5') {
          return h(
            'div',
            { id, className: 'taro_page' },
            children
          )
        } else {
          return h(
            'root',
            { id },
            children
          )
        }
      }
    }
  }
}

/**
 * 桥接小程序 App 构造器和 React 渲染流程
 * @param App 用户编写的入口组件
 * @param react 框架
 * @param dom 框架渲染器
 * @param config 入口组件配置 app.config.js 的内容
 * @returns 传递给 App 构造器的对象 obj ：App(obj)
 */
export function createReactApp (
  App: React.ComponentClass,
  react: typeof React,
  dom,
  config: AppConfig
) {
  if (process.env.NODE_ENV !== 'production') {
    ensure(!!dom, '构建 React/Nerv 项目请把 process.env.FRAMEWORK 设置为 \'react\'/\'nerv\' ')
  }

  reactMeta.R = react
  h = react.createElement
  ReactDOM = dom
  const appInstanceRef = react.createRef<ReactAppInstance>()
  const isReactComponent = isClassComponent(react, App)
  let appWrapper: AppWrapper

  setReconciler(ReactDOM)

  function getAppInstance (): ReactAppInstance | null {
    return appInstanceRef.current
  }

  function renderReactRoot () {
    const reactMode = __TARO_FRAMEWORK_REACT_MODE__
    let appId = 'app'
    if (process.env.TARO_ENV === 'h5') {
      appId = config?.appId || appId
    } else {
      ReactDOM.version = react.version
    }
    const container = document.getElementById(appId)
    const version = Number((ReactDOM.version || '').split('.')[0])
    if (version >= 18 && reactMode === 'concurrent') {
      const root = ReactDOM.createRoot(container)
      root.render?.(h(AppWrapper))
    } else {
      ReactDOM.render?.(h(AppWrapper), container)
    }
  }

  class AppWrapper extends react.Component {
    // run createElement() inside the render function to make sure that owner is right
    private pages: Array<() => PageComponent> = []
    private elements: Array<PageComponent> = []

    constructor (props) {
      super(props)
      appWrapper = this
    }

    public mount (pageComponent: ReactPageComponent, id: string, cb: () => void) {
      const pageWrapper = connectReactPage(react, id)(pageComponent)
      const key = id + pageKeyId()
      const page = () => h(pageWrapper, { key, tid: id })
      this.pages.push(page)
      this.forceUpdate(cb)
    }

    public unmount (id: string, cb: () => void) {
      const elements = this.elements
      const idx = elements.findIndex(item => item.props.tid === id)
      elements.splice(idx, 1)
      this.forceUpdate(cb)
    }

    public render () {
      const { pages, elements } = this

      while (pages.length > 0) {
        const page = pages.pop()!
        elements.push(page())
      }

      let props: React.ComponentProps<any> | null = null

      if (isReactComponent) {
        props = { ref: appInstanceRef }
      }

      return h(
        App,
        props,
        process.env.TARO_ENV === 'h5' ? h('div', null, elements.slice()) : elements.slice()
      )
    }
  }

  if (process.env.TARO_ENV !== 'h5') {
    renderReactRoot()
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.getMiniLifecycleImpl().app

  const appObj: AppInstance = Object.create({
    render (cb: () => void) {
      appWrapper.forceUpdate(cb)
    },

    mount (component: ReactPageComponent, id: string, cb: () => void) {
      appWrapper.mount(component, id, cb)
    },

    unmount (id: string, cb: () => void) {
      appWrapper.unmount(id, cb)
    }
  }, {
    config: setDefaultDescriptor({
      configurable: true,
      value: config
    }),

    [ONLAUNCH]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)

        if (process.env.TARO_ENV === 'h5') {
          // 由于 H5 路由初始化的时候会清除 app 下的 dom 元素，所以需要在路由初始化后执行 render
          renderReactRoot()
        }

        // 用户编写的入口组件实例
        const app = getAppInstance()
        this.$app = app

        if (app) {
          // 把 App Class 上挂载的额外属性同步到全局 app 对象中
          if (app.taroGlobalData) {
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

          app.onLaunch?.(options)
        }
      }
    }),

    [ONSHOW]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)

        /**
         * trigger lifecycle
         */
        const app = getAppInstance()
        // class component, componentDidShow
        app?.componentDidShow?.(options)
        // functional component, useDidShow
        triggerAppHook('onShow', options)
      }
    }),

    [ONHIDE]: setDefaultDescriptor({
      value () {
        /**
         * trigger lifecycle
         */
        const app = getAppInstance()
        // class component, componentDidHide
        app?.componentDidHide?.()
        // functional component, useDidHide
        triggerAppHook('onHide')
      }
    }),

    onPageNotFound: setDefaultDescriptor({
      value (res: unknown) {
        const app = getAppInstance()
        app?.onPageNotFound?.(res)
      }
    })
  })

  function triggerAppHook (lifecycle, ...option) {
    const instance = getPageInstance(HOOKS_APP_ID)
    if (instance) {
      const app = getAppInstance()
      const func = hooks.getLifecycle(instance, lifecycle)
      if (Array.isArray(func)) {
        func.forEach(cb => cb.apply(app, option))
      }
    }
  }

  Current.app = appObj
  return appObj
}
