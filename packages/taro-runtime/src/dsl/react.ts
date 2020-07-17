import type * as React from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppConfig } from '@tarojs/taro'
import { isFunction, ensure, EMPTY_OBJ } from '@tarojs/shared'
import { Current } from '../current'
import { AppInstance, ReactPageComponent, PageProps, Instance, ReactAppInstance } from './instance'
import { document } from '../bom/document'
import { injectPageInstance } from './common'
import { isBrowser } from '../env'
import { options } from '../options'
import { Reconciler } from '../reconciler'
import { incrementId } from '../utils'

function isClassComponent (R: typeof React, component): boolean {
  return isFunction(component.render) ||
  !!component.prototype?.isReactComponent ||
  component.prototype instanceof R.Component // compat for some others react-like library
}

export function connectReactPage (
  R: typeof React,
  id: string
) {
  const h = R.createElement
  return (component: ReactPageComponent): React.ComponentClass<PageProps> => {
    // eslint-disable-next-line dot-notation
    const isReactComponent = isClassComponent(R, component)

    const inject = (node?: Instance) => node && injectPageInstance(node, id)
    const refs = isReactComponent ? { ref: inject } : { forwardedRef: inject }

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

// 初始值设置为 any 主要是为了过 TS 的校验
export let R: typeof React = EMPTY_OBJ
export let PageContext: React.Context<string> = EMPTY_OBJ

let ReactDOM

type PageComponent = React.CElement<PageProps, React.Component<PageProps, any, any>>

function setReconciler () {
  const hostConfig: Reconciler<React.FunctionComponent<PageProps> | React.ComponentClass<PageProps>> = {
    getLifecyle (instance, lifecycle) {
      if (lifecycle === 'onShow') {
        lifecycle = 'componentDidShow'
      } else if (lifecycle === 'onHide') {
        lifecycle = 'componentDidHide'
      }
      return instance[lifecycle] as Function
    },
    mergePageInstance (prev, next) {
      if (!prev || !next) return

      // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。
      Object.keys(prev).forEach(item => {
        if (isFunction(next[item])) {
          next[item] = [next[item], ...prev[item]]
        } else {
          next[item] = [...(next[item] || []), ...prev[item]]
        }
      })
    }
  }

  if (isBrowser) {
    hostConfig.createPullDownComponent = (el, _, R: typeof React) => {
      const isReactComponent = isClassComponent(R, el)

      return R.forwardRef((props, ref) => {
        const newProps: React.Props<any> = { ...props }
        if (isReactComponent) {
          newProps.ref = ref
        }

        return R.createElement('taro-pull-to-refresh', null, R.createElement(el, newProps))
      })
    }

    hostConfig.findDOMNode = (inst) => {
      return ReactDOM.findDOMNode(inst)
    }
  }

  options.reconciler(hostConfig)
}

const tabbarId = incrementId()

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
      let key = id
      if (id.startsWith('custom-tab-bar')) {
        key += tabbarId()
      }
      const page = () => R.createElement(component, { key, tid: id })
      this.pages.push(page)
      this.forceUpdate(cb)
    }

    public unmount (id: string, cb: () => void) {
      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i]
        if (element.key === id) {
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

  class AppConfig implements AppInstance {
    config = config

    onLaunch (options) {
      // eslint-disable-next-line react/no-render-return-value
      wrapper = ReactDOM.render(R.createElement(AppWrapper), document.getElementById('app'))
      const app = ref.current
      Current.router = {
        params: options?.query,
        ...options
      }
      if (app != null && isFunction(app.onLaunch)) {
        app.onLaunch(options)
      }
    }

    onShow (options) {
      const app = ref.current
      Current.router = {
        params: options?.query,
        ...options
      }
      if (app != null && isFunction(app.componentDidShow)) {
        app.componentDidShow(options)
      }
    }

    onHide (options: unknown) {
      const app = ref.current
      if (app != null && isFunction(app.componentDidHide)) {
        app.componentDidHide(options)
      }
    }

    render (cb: () => void) {
      wrapper.forceUpdate(cb)
    }

    mount (component: ReactPageComponent, id: string, cb: () => void) {
      const page = connectReactPage(R, id)(component)
      wrapper.mount(page, id, cb)
    }

    unmount (id: string, cb: () => void) {
      wrapper.unmount(id, cb)
    }
  }

  Current.app = new AppConfig()
  return Current.app
}
