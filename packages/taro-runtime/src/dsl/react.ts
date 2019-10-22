import * as React from 'react'
import { isFunction } from '@tarojs/shared'
import { Current } from '../current'
import { AppInstance, ReactPageInstance, ReactPageComponent, PageProps } from './instance'
import { document } from '../bom/document'

export function connectReactPage (
  h: typeof React.createElement, // 为了支持 React 和 React-like
  id: string
) {
  return (component: ReactPageComponent): React.FunctionComponent<PageProps> => {
    return (props: PageProps) => {
      return h(
        'root',
        { id },
        h(component, props)
      )
    }
  }
}

export function createReactApp (R: typeof React, App: React.ComponentClass, render) {
  const ref = R.createRef<ReactPageInstance>()

  let wrapper: AppWrapper

  class AppWrapper extends R.Component {
    private pages: Array<() => React.FunctionComponentElement<PageProps>> = []
    private elements: Array<React.FunctionComponentElement<PageProps>> = []

    public mount (component: React.FunctionComponent<PageProps>, id: string, cb: () => void) {
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
        this.elements.slice()
      )
    }
  }

  class AppConfig implements AppInstance {
    onLaunch () {
      wrapper = render(R.createElement(AppWrapper), document.getElementById('app'))
    }

    onShow (options: unknown) {
      const app = ref.current
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
      const page = connectReactPage(R.createElement, id)(component)
      wrapper.mount(page, id, cb)
    }

    unmount (id: string, cb: () => void) {
      wrapper.unmount(id, cb)
    }
  }

  Current.app = new AppConfig()
  return Current.app
}
