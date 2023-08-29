import { Current, document } from '@tarojs/runtime'

import { setReconciler } from './connect'
import { injectPageInstance } from './page'
import { EMPTY_OBJ, incrementId, isClassComponent } from './utils'

import type React from 'react'

let h: typeof React.createElement
let ReactDOM

interface IReactMeta {
  PageContext: React.Context<string>
  R: typeof React
  Container: any
}

export const ReactMeta: IReactMeta = {
  R: EMPTY_OBJ,
  Container: EMPTY_OBJ,
  PageContext: EMPTY_OBJ
}

const pageKeyId = incrementId()

export function connectReactPage (
  R: typeof React,
  id: string
) {
  return (Page): React.ComponentClass<any> => {
    // eslint-disable-next-line dot-notation
    const isReactComponent = isClassComponent(R, Page)
    const inject = (node?: any) => node && injectPageInstance(node, id)
    const refs = isReactComponent ? { ref: inject } : {
      forwardedRef: inject,
      // 兼容 react-redux 7.20.1+
      reactReduxForwardedRef: inject
    }

    if (ReactMeta.PageContext === EMPTY_OBJ) {
      ReactMeta.PageContext = R.createContext('')
    }

    return class PageWrapper extends R.Component<any, { hasError: boolean }> {
      state = {
        hasError: false
      }

      static getDerivedStateFromError (error: Error) {
        Current.app?.onError?.(error.message + error.stack)
        return { hasError: true }
      }

      // React 16 uncaught error 会导致整个应用 crash，
      // 目前把错误缩小到页面
      componentDidCatch (error, info: React.ErrorInfo) {
        console.warn(error)
        console.error(info.componentStack)
      }

      render () {
        const children = this.state.hasError
          ? []
          : h(ReactMeta.PageContext.Provider, { value: id }, h(Page, {
            ...this.props,
            ...refs
          }))

        // TODO root
        return h(
          'view',
          { id },
          children
        )
      }
    }
  }
}

export function createReactApp (
  App,
  react,
  dom,
  _config?: any
) {
  ReactMeta.R = react
  h = react.createElement
  ReactDOM = dom
  const appInstanceRef = react.createRef()
  const isReactComponent = isClassComponent(react, App)
  let appWrapper: AppWrapper
  let appWrapperResolver: (value: AppWrapper) => void
  const appWrapperPromise = new Promise<AppWrapper>(resolve => (appWrapperResolver = resolve))

  setReconciler(ReactDOM)

  function getAppInstance (): any {
    return appInstanceRef.current
  }

  function waitAppWrapper (cb: () => void) {
    appWrapper ? cb() : appWrapperPromise.then(() => cb())
  }

  function renderReactRoot () {
    const appId = 'app'

    if (ReactMeta.Container === EMPTY_OBJ) {
      const Container = document.createElement('view')

      Container.id = appId
      ReactMeta.Container = Container
    }

    const root = ReactDOM.createRoot(ReactMeta.Container)
    root.render?.(h(AppWrapper as any))
  }

  class AppWrapper extends react.Component {
    private pages: Array<any> = []
    private elements: Array<any> = []

    constructor (props) {
      super(props)
      appWrapper = this
      appWrapperResolver(this)
    }

    public mount (pageComponent: any, id: string, cb: () => void) {
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
        elements.slice()
      )
    }
  }

  renderReactRoot()

  const app = {
    render (cb: () => void) {
      appWrapper.forceUpdate(cb)
    },
    mount (component: any, id: string, cb: () => void) {
      if (appWrapper) {
        appWrapper.mount(component, id, cb)
      } else {
        appWrapperPromise.then(appWrapper => appWrapper.mount(component, id, cb))
      }
    },

    unmount (id: string, cb: () => void) {
      appWrapper.unmount(id, cb)
    },
    onLaunch (_?: any) {
      waitAppWrapper(() => {
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

          app.onCreate?.()
        }
      })
    },
    onShow () {
      waitAppWrapper(() => {
        /**
        * trigger lifecycle
        */
        const app = getAppInstance()
        // class component, componentDidShow
        app?.componentDidShow?.()
      })
    },
    onHide () {
      waitAppWrapper(() => {
        /**
        * trigger lifecycle
        */
        const app = getAppInstance()
        // class component, componentDidShow
        app?.componentDidHide?.()
      })
    }
  }

  // TODO: function componennt hook
  // function triggerAppHook (lifecycle: string, ...option) {
  //   const instance = getPageInstance('taro-app')
  //   if (instance) {
  //     const app = getAppInstance()
  //     const func = hooks.call('getLifecycle', instance, lifecycle)
  //     if (Array.isArray(func)) {
  //       func.forEach(cb => cb.apply(app, option))
  //     }
  //   }
  // }

  Current.app = app

  return app
}
