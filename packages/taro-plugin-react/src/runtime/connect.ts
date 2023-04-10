import {
  AppInstance, Current, document, getPageInstance,
  incrementId, injectPageInstance, Instance,
  PageLifeCycle, PageProps,
  ReactAppInstance, ReactPageComponent
} from '@tarojs/runtime'
import { EMPTY_OBJ, ensure, hooks, isWebPlatform } from '@tarojs/shared'

import { reactMeta } from './react-meta'
import { ensureIsArray, HOOKS_APP_ID, isClassComponent, setDefaultDescriptor, setRouterParams } from './utils'

import type { AppConfig } from '@tarojs/taro'
import type * as React from 'react'

type PageComponent = React.CElement<PageProps, React.Component<PageProps, any, any>>

let h: typeof React.createElement
let ReactDOM
let Fragment: typeof React.Fragment

const pageKeyId = incrementId()
const isWeb = isWebPlatform()

export function setReconciler (ReactDOM) {
  hooks.tap('getLifecycle', function (instance, lifecycle: string) {
    lifecycle = lifecycle.replace(/^on(Show|Hide)$/, 'componentDid$1')
    return instance[lifecycle]
  })

  hooks.tap('modifyMpEvent', function (event) {
    // Note: ohos 上事件没有设置 type 类型 setter 方法导致报错
    Object.defineProperty(event, 'type', {
      value: event.type.replace(/-/g, '')
    })
  })

  hooks.tap('batchedEventUpdates', function (cb) {
    ReactDOM.unstable_batchedUpdates(cb)
  })

  hooks.tap('mergePageInstance', function (prev, next) {
    if (!prev || !next) return

    // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。

    // prev 使用 Object.create(null) 创建，H5 的 fast-refresh 可能也会导致存在 prev，要排除这些意外产生的 prev
    if ('constructor' in prev) return

    Object.keys(prev).forEach(item => {
      const prevList = prev[item]
      const nextList = ensureIsArray<() => any>(next[item])
      next[item] = nextList.concat(prevList)
    })
  })

  if (isWeb) {
    hooks.tap('createPullDownComponent', (
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
    })

    hooks.tap('getDOMNode', inst => {
      return ReactDOM.findDOMNode(inst)
    })
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
        Current.app?.onError?.(error.message + error.stack)
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

        if (isWeb) {
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
  Fragment = react.Fragment
  const appInstanceRef = react.createRef<ReactAppInstance>()
  const isReactComponent = isClassComponent(react, App)
  let appWrapper: AppWrapper
  let appWrapperResolver: (value: AppWrapper) => void
  const appWrapperPromise = new Promise<AppWrapper>(resolve => (appWrapperResolver = resolve))

  setReconciler(ReactDOM)

  function getAppInstance (): ReactAppInstance | null {
    return appInstanceRef.current
  }

  function waitAppWrapper (cb: () => void) {
    appWrapper ? cb() : appWrapperPromise.then(() => cb())
  }

  function renderReactRoot () {
    let appId = 'app'
    if (isWeb) {
      appId = config?.appId || appId
    }
    const container = document.getElementById(appId)
    if((react.version || '').startsWith('18')){
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
      appWrapperResolver(this)
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
        isWeb ? h(Fragment ?? 'div', null, elements.slice()) : elements.slice()
      )
    }
  }

  if (!isWeb) {
    renderReactRoot()
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.call('getMiniLifecycleImpl')!.app

  const appObj: AppInstance = Object.create({
    render (cb: () => void) {
      appWrapper.forceUpdate(cb)
    },

    mount (component: ReactPageComponent, id: string, cb: () => void) {
      if (appWrapper) {
        appWrapper.mount(component, id, cb)
      } else {
        appWrapperPromise.then(appWrapper => appWrapper.mount(component, id, cb))
      }
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

        if (isWeb) {
          // 由于 H5 路由初始化的时候会清除 app 下的 dom 元素，所以需要在路由初始化后执行 render
          renderReactRoot()
        }

        const onLaunch = () => {
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
          triggerAppHook('onLaunch', options)
        }

        waitAppWrapper(onLaunch)
      }
    }),

    [ONSHOW]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)

        const onShow = () => {
          /**
          * trigger lifecycle
          */
          const app = getAppInstance()
          // class component, componentDidShow
          app?.componentDidShow?.(options)
          // functional component, useDidShow
          triggerAppHook('onShow', options)
        }

        waitAppWrapper(onShow)
      }
    }),

    [ONHIDE]: setDefaultDescriptor({
      value () {
        const onHide = () => {
          /**
           * trigger lifecycle
           */
          const app = getAppInstance()
          // class component, componentDidHide
          app?.componentDidHide?.()
          // functional component, useDidHide
          triggerAppHook('onHide')
        }

        waitAppWrapper(onHide)
      }
    }),

    onError: setDefaultDescriptor({
      value (error: string) {
        const onError = () => {
          const app = getAppInstance()
          app?.onError?.(error)
          triggerAppHook('onError', error)
          if (process.env.NODE_ENV !== 'production' && error?.includes('Minified React error')) {
            console.warn('React 出现报错，请打开编译配置 mini.debugReact 查看报错详情：https://docs.taro.zone/docs/config-detail#minidebugreact')
          }
        }

        waitAppWrapper(onError)
      }
    }),

    onUnhandledRejection: setDefaultDescriptor({
      value (res: unknown) {
        const onUnhandledRejection = () => {
          const app = getAppInstance()
          app?.onUnhandledRejection?.(res)
          triggerAppHook('onUnhandledRejection', res)
        }

        waitAppWrapper(onUnhandledRejection)
      }
    }),

    onPageNotFound: setDefaultDescriptor({
      value (res: unknown) {
        const onPageNotFound = () => {
          const app = getAppInstance()
          app?.onPageNotFound?.(res)
          triggerAppHook('onPageNotFound', res)
        }

        waitAppWrapper(onPageNotFound)
      }
    })
  })

  function triggerAppHook (lifecycle: keyof PageLifeCycle | keyof AppInstance, ...option) {
    const instance = getPageInstance(HOOKS_APP_ID)
    if (instance) {
      const app = getAppInstance()
      const func = hooks.call('getLifecycle', instance, lifecycle)
      if (Array.isArray(func)) {
        func.forEach(cb => cb.apply(app, option))
      }
    }
  }

  Current.app = appObj
  return appObj
}
