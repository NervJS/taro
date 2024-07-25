import { Current, document, eventCenter } from '@tarojs/runtime'

import { setReconciler } from './connect'
import { injectPageInstance } from './page'
import { EMPTY_OBJ, incrementId, isClassComponent } from './utils'

import type { AppInstance } from '@tarojs/runtime'
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

const pageKeyId = incrementId(1)

export function connectReactPage (
  R: typeof React,
  id: string,
  getCtx: () => any
) {
  const ctx = getCtx?.()

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
            ...Object.assign({}, ctx?.props, this.props),
            ...refs
          }))

        return h(
          'taro-page',
          { id, className: 'taro_page' },
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
  config?: any
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
    const appId = config?.appId || 'app'

    if (ReactMeta.Container === EMPTY_OBJ) {
      const Container = document.getElementById(appId)

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

    public mount (pageComponent: any, id: string, getCtx: () => any, cb: () => void) {
      const pageWrapper = connectReactPage(react, id, getCtx)(pageComponent)
      const key = `${id}_${pageKeyId()}`
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
    mount (component: any, id: string, getCtx: () => any, cb: () => void) {
      if (appWrapper) {
        appWrapper.mount(component, id, getCtx, cb)
      } else {
        appWrapperPromise.then(appWrapper => appWrapper.mount(component, id, getCtx, cb))
      }
    },
    unmount (id: string, cb: () => void) {
      appWrapper?.unmount(id, cb)
    },
    onLaunch (launchParam?: any) {
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
              Object.defineProperty(Current?.app || this, key, {
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
            Object.defineProperties(Current?.app || this, descriptors)
          }

          app.onCreate?.()
        }

        eventCenter.trigger('__taroRouterLaunch', launchParam)
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
  } as unknown as AppInstance

  if (Current.app) {
    Current.app = Object.assign(app, Current.app)
  } else {
    Current.app = app
  }

  return app
}
