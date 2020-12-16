import * as React from 'react'
import { createRouter, RouterConfig } from '@tarojs/router-rn'
import { Provider as TCNProvider } from '@tarojs/components-rn'
import { Current } from './current'
import { RNAppConfig } from './types/index'
import { AppInstance } from './instance'
import { isFunction } from './utils'

export function isClassComponent (component): boolean {
  return isFunction(component.render) ||
    !!component.prototype?.isReactComponent ||
    component.prototype instanceof React.Component
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createReactNativeApp (component: React.ComponentClass, config: RNAppConfig) {
  const routerConfig: RouterConfig = {
    tabBar: config.appConfig.tabBar,
    pages: config.pageList,
    window: config.appConfig.window,
    linkPrefix: config.appConfig.linkPrefix || [],
    rnConfig: config.appConfig.rn || {}
  }

  const ref = React.createRef<AppInstance>()

  const isReactComponent = isClassComponent(component)

  const NewAppComponent = (AppCompoent) => {
    return class Entry extends React.Component {
      render () {
        let props: React.Props<any> | null = null

        if (isReactComponent) {
          props = { ref }
        }
        return React.createElement(TCNProvider, { ...this.props },
          React.createElement(AppCompoent, { ...props },
            createRouter(routerConfig)
          ))
      }
    }
  }

  const App = NewAppComponent(component)

  // 与小程序端实例保持一致
  const appInst = Object.create({}, {
    config: {
      writable: true,
      enumerable: true,
      configurable: true,
      value: config.appConfig
    },
    onLaunch: {
      enumerable: true,
      writable: true,
      value (options) {
        const app = ref.current
        if (app != null && isFunction(app.onLaunch)) {
          app.onLaunch && app.onLaunch(options)
        }
      }
    },
    onShow: {
      enumerable: true,
      writable: true,
      value (options) {
        const app = ref.current
        if (app != null && isFunction(app.componentDidShow)) {
          app.componentDidShow && app.componentDidShow(options)
        }
      }
    },
    onHide: {
      enumerable: true,
      writable: true,
      value (options: unknown) {
        const app = ref.current
        if (app != null && isFunction(app.componentDidHide)) {
          app.componentDidHide && app.componentDidHide(options)
        }
      }
    }
  })

  Current.app = appInst
  return App
}

export function getApp (): any {
  return Current.app
}
