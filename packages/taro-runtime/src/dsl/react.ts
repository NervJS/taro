import * as React from 'react'
import { isFunction, ensure, EMPTY_OBJ } from '@tarojs/shared'
import { Current } from '../current'
import { AppInstance, ReactPageInstance, ReactPageComponent, PageProps, Instance } from './instance'
import { document } from '../bom/document'
import { injectPageInstance, getPageInstance } from './common'
import { isBrowser } from '../env'

export function connectReactPage (
  R: typeof React,
  id: string
) {
  const h = R.createElement
  return (component: ReactPageComponent): React.ComponentClass<PageProps> => {
    // eslint-disable-next-line dot-notation
    const isReactComponent = isFunction(component['render']) ||
      !!component.prototype?.isReactComponent ||
      component.prototype instanceof R.Component // compat for some others react-like library

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

if (process.env.FRAMEWORK === 'nerv') {
  R = require('nervjs')
  ReactDOM = R
}

// 其它 react-like 框架走 react 模式，在 webpack.resolve.alias 设置 react/react-dom 到对应包
if (process.env.FRAMEWORK === 'react') {
  R = require('react')
  ReactDOM = require('react-dom')
}

export const taroHooks = (lifecycle: string) => {
  return (fn: Function) => {
    const id = R.useContext(PageContext)
    let inst = getPageInstance(id)
    R.useLayoutEffect(() => {
      let first = false
      if (inst == null) {
        first = true
        inst = Object.create(null)
      }
      inst![lifecycle] = fn.bind(null)
      if (first) {
        injectPageInstance(inst!, id)
      }
    }, [])
  }
}

type PageComponent = React.CElement<PageProps, React.Component<PageProps, any, any>>

export function createReactApp (App: React.ComponentClass, react?: typeof React) {
  ensure(!!ReactDOM, '构建 React/Nerv 项目请把 process.env.FRAMEWORK 设置为 \'react\'/\'nerv\' ')

  if (react != null) {
    R = react
  }

  const ref = R.createRef<ReactPageInstance>()

  let wrapper: AppWrapper

  class AppWrapper extends R.Component {
    // run createElement() inside the render function to make sure that owner is right
    private pages: Array<() => PageComponent> = []
    private elements: Array<PageComponent> = []

    public mount (component: React.ComponentClass<PageProps>, id: string, cb: () => void) {
      const page = () => R.createElement(component, { key: id, tid: id })
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

      return R.createElement(
        App,
        { ref },
        isBrowser ? R.createElement('div', null, this.elements.slice()) : this.elements.slice()
      )
    }
  }

  class AppConfig implements AppInstance {
    onLaunch () {
      wrapper = ReactDOM.render(R.createElement(AppWrapper), document.getElementById('app'))
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
