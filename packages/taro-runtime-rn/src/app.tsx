import { Provider as TCNProvider } from '@tarojs/components-rn'
import { createRouter, RouterConfig } from '@tarojs/router-rn'
import React, { Component, ComponentProps, createRef, forwardRef } from 'react'
import { RootSiblingParent } from 'react-native-root-siblings'

import { Current } from './current'
import { AppInstance, PageLifeCycle } from './instance'
import { getPageInstance } from './page'
import { RNAppConfig } from './types/index'
import { HOOKS_APP_ID, isFunction } from './utils'


export function isClassComponent (component): boolean {
  return isFunction(component?.render) ||
    !!component.prototype?.isReactComponent ||
    component.prototype instanceof Component
}


export function createReactNativeApp (AppEntry: any, config: RNAppConfig) {
  const routerConfig: RouterConfig = {
    tabBar: config.appConfig.tabBar,
    pages: config.pageList,
    entryPagePath: config.appConfig.entryPagePath,
    window: config.appConfig.window,
    linkPrefix: config.appConfig.linkPrefix || [],
    rnConfig: config.appConfig.rn || {}
  }

  const appRef = createRef<AppInstance>()
  const isReactComponent = isClassComponent(AppEntry)
  let AppComponent:any = AppEntry
  if(!isReactComponent){ 
    // eslint-disable-next-line react/display-name
    AppComponent = forwardRef((props, ref) => {
      return <AppEntry forwardRef={ref}  {...props} />
    })
  }

  const NewAppComponent = (AppCompoent) => {
    return class Entry extends Component <any, any> {


      // 导航onReady
      onReady (options){
        triggerAppLifecycle('componentDidShow',options)
        triggerAppLifecycle('onLaunch',options)
      }

      render () {
        const props: ComponentProps<any> | null = null

        const { initPath = '', initParams = {} } = this.props
        const appProps = {
          ...props,
          ...this.props
        }
        routerConfig.initPath = initPath
        routerConfig.initParams = initParams
        return <RootSiblingParent>
          <TCNProvider {...this.props}>
            <AppCompoent {...appProps} ref={appRef}>
              {createRouter(routerConfig, this.onReady)}
            </AppCompoent>
          </TCNProvider>
        </RootSiblingParent>
      }
    }
  }

  const App = NewAppComponent(AppComponent)

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
        triggerAppLifecycle('onLaunch', options)
      }
    },
    onShow: {
      enumerable: true,
      writable: true,
      value (options) {
        triggerAppLifecycle('componentDidShow', options)
      }
    },
    onHide: {
      enumerable: true,
      writable: true,
      value (options: unknown) {
        triggerAppLifecycle('componentDidHide',options)
      }
    }
  })

  function triggerAppLifecycle (lifecycle: keyof PageLifeCycle | keyof AppInstance, ...args){
    try {
      const app = appRef.current
      if(isReactComponent){
        app?.[lifecycle] && app?.[lifecycle](...args)
      }else{
        const instance = getPageInstance(HOOKS_APP_ID)
        if(instance){
          const func = instance[lifecycle]
          if (Array.isArray(func)) {
            func.forEach(cb => cb.apply(app, args))
          }
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  Current.app = appInst
  return App
}

export function getApp (): any {
  return Current.app
}
