import * as React from 'react'
import { isFunction } from '@tarojs/shared'
import { Current } from '../current'
import { AppInstance, ReactPageInstance } from './instance'
import { document } from '../bom/document'

export function connectReactPage (
  h: typeof React.createElement, // 为了支持 React 和 React-like
  derivedIDfromCompiler: string
) {
  return (component: React.ComponentClass) => {
    return (props) => {
      return h(
        'root',
        {
          id: derivedIDfromCompiler
        },
        h(component, props)
      )
    }
  }
}

export function createReactApp (R: typeof React, App: React.ComponentClass<any>, render) {
  const ref = R.createRef<ReactPageInstance>()

  let wrapper: React.Component

  class AppWrapper extends R.Component {
    render () {
      const children: any[] = []

      Current.instances.forEach((inst: ReactPageInstance, id) => {
        children.push({
          inst,
          id
        })
      })

      return R.createElement(
        R.Fragment,
        null,
        R.createElement(
          App,
          { ref },
          children.map(({ inst, id }) => R.createElement(inst, { key: id, tid: id }))
        )
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

    mount (component: React.ComponentClass, id: string, cb: () => void) {
      const page = connectReactPage(React.createElement, id)(component)
      Current.instances.set(id, page)
      this.render(cb)
    }

    unmount (id: string, cb: () => void) {
      Current.instances.delete(id)
      this.render(cb)
    }
  }

  Current.app = new AppConfig()
  return Current.app
}
