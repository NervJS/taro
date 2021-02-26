import type * as React from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppConfig } from '@tarojs/taro'
import { isFunction, ensure, EMPTY_OBJ } from '@tarojs/shared'
import { Current } from '../current'
import { AppInstance, ReactPageComponent, PageProps, Instance, ReactAppInstance } from './instance'
import { document } from '../bom/document'
import { getPageInstance, injectPageInstance } from './common'
import { isBrowser } from '../env'
import { options } from '../options'
import { Reconciler, CurrentReconciler } from '../reconciler'
import { incrementId } from '../utils'
import { HOOKS_APP_ID } from './hooks'
import type { Func } from '../utils/types'

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
        console.warn(error)
        return { hasError: true }
      }

      // React 16 uncaught error 会导致整个应用 crash，
      // 目前把错误缩小到页面
      componentDidCatch (error: Error, info: React.ErrorInfo) {
        console.warn(error)
        console.error(info.componentStack)
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
  const hostConfig: Partial<Reconciler<React.FunctionComponent<PageProps> | React.ComponentClass<PageProps>>> = {
    getLifecyle (instance, lifecycle) {
      if (lifecycle === 'onShow') {
        lifecycle = 'componentDidShow'
      } else if (lifecycle === 'onHide') {
        lifecycle = 'componentDidHide'
      }
      return instance[lifecycle] as Func
    },
    mergePageInstance (prev, next) {
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
    },
    modifyEventType (event) {
      event.type = event.type.replace(/-/g, '')
    },
    batchedEventUpdates (cb) {
      ReactDOM.unstable_batchedUpdates(cb)
    }
  }

  if (isBrowser) {
    hostConfig.createPullDownComponent = (el, _, R: typeof React) => {
      const isReactComponent = isClassComponent(R, el)

      return R.forwardRef((props, ref) => {
        const newProps: React.Props<any> = { ...props }
        const refs = isReactComponent ? { ref: ref } : {
          forwardedRef: ref,
          // 兼容 react-redux 7.20.1+
          reactReduxForwardedRef: ref
        }

        return R.createElement('taro-pull-to-refresh', null, R.createElement(el, {
          ...newProps,
          ...refs
        }))
      })
    }

    hostConfig.findDOMNode = (inst) => {
      return ReactDOM.findDOMNode(inst)
    }
  }

  options.reconciler(hostConfig)
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
        triggerAppHook('componentDidShow')
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
        triggerAppHook('componentDidHide')
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
      const func = CurrentReconciler.getLifecyle(instance, lifecycle)
      if (Array.isArray(func)) {
        func.forEach(cb => cb.apply(app))
      }
    }
  }

  Current.app = app
  return Current.app
}
