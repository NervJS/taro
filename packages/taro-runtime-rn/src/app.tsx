import { Provider as TCNProvider } from '@tarojs/components-rn'
import { createRouter, RouterConfig } from '@tarojs/router-rn'
import React, { Component, ComponentClass,ComponentProps, createRef } from 'react'
import { RootSiblingParent } from 'react-native-root-siblings'

import { Current } from './current'
import { AppInstance } from './instance'
import { RNAppConfig } from './types/index'
import { isFunction } from './utils'

export function isClassComponent (component): boolean {
  return isFunction(component.render) ||
    !!component.prototype?.isReactComponent ||
    component.prototype instanceof Component
}

export function createReactNativeApp (component: ComponentClass, config: RNAppConfig) {
  const routerConfig: RouterConfig = {
    tabBar: config.appConfig.tabBar,
    pages: config.pageList,
    entryPagePath: config.appConfig.entryPagePath,
    window: config.appConfig.window,
    linkPrefix: config.appConfig.linkPrefix || [],
    rnConfig: config.appConfig.rn || {}
  }

  const ref = createRef<AppInstance>()

  const isReactComponent = isClassComponent(component)

  const NewAppComponent = (AppCompoent) => {
    return class Entry extends Component <any, any> {
      render () {
        let props: ComponentProps<any> | null = null

        if (isReactComponent) {
          props = { ref }
        }
        const { initPath = '', initParams = {} } = this.props
        const appProps = {
          ...props,
          ...this.props
        }
        routerConfig.initPath = initPath
        routerConfig.initParams = initParams
        return <RootSiblingParent>
          <TCNProvider {...this.props}>
            <AppCompoent {...appProps}>
              {createRouter(routerConfig)}
            </AppCompoent>
          </TCNProvider>
        </RootSiblingParent>
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
