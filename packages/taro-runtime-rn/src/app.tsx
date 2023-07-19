import { Provider as TCNProvider } from '@tarojs/components-rn'
import React, { Component, ComponentProps, createElement,createRef, forwardRef } from 'react'
import { RootSiblingParent } from 'react-native-root-siblings'

import { Current } from './current'
import EventChannel from './EventChannel'
import { AppInstance, PageLifeCycle } from './instance'
import { getPageInstance } from './page'
import { createRouter, getInitOptions, getRouteEventChannel } from './router'
import { RNAppConfig } from './types/index'
import { HOOKS_APP_ID, isFunction } from './utils'


export function isClassComponent (component): boolean {
  return isFunction(component?.render) ||
    !!component.prototype?.isReactComponent ||
    component.prototype instanceof Component
}


export function createReactNativeApp (AppEntry: any, config: RNAppConfig, FirstPage: any) {
  const singleMode = config?.appConfig?.rn?.singleMode ?? false
  const needNavigate = config.pageList.length !== 1 || !singleMode
  if (needNavigate) {
    getRouteEventChannel(EventChannel.routeChannel)
  }
  const routerConfig: any = {
    tabBar: config.appConfig.tabBar,
    pages: config.pageList,
    entryPagePath: config.appConfig.entryPagePath,
    window: config.appConfig.window,
    linkPrefix: config.appConfig.linkPrefix || [],
    rnConfig: config.appConfig.rn || {}
  }

  const appRef = createRef<AppInstance>()
  const isReactComponent = isClassComponent(AppEntry)
  let entryComponent:any = AppEntry
  if(!isReactComponent){ 
    // eslint-disable-next-line react/display-name
    entryComponent = forwardRef((props, ref) => {
      return <AppEntry forwardRef={ref}  {...props} />
    })
  }


  const NewAppComponent = (AppComponent) => {
    return class Entry extends Component <any, any> {

      constructor (props){
        super(props)
        const { initPath = '', initParams = {} } = this.props
        routerConfig.initPath = initPath
        routerConfig.initParams = initParams

      }

      componentDidMount () {
        let options: any = {}
        if (needNavigate) {
          options = getInitOptions(routerConfig)
        }
        triggerAppLifecycle('onLaunch', options)
        triggerAppLifecycle('componentDidShow', options)
      }

      // 导航onUnhandledAction
      onUnhandledAction (options){
        triggerAppLifecycle('onPageNotFound',options)
      }

      render () {
        const props: ComponentProps<any> | null = null

        const appProps = {
          ...props,
          ...this.props
        }

        let routerOptions: any = {}
        if (needNavigate) {
          routerOptions = {
            onUnhandledAction: this.onUnhandledAction,
          }
        }

        const child = needNavigate ? createRouter(routerConfig, routerOptions) : createElement(FirstPage, { ...this.props }, [])

        return createElement(
          RootSiblingParent,
          null,
          createElement(
            TCNProvider,
            { ...this.props },
            createElement(AppComponent, { ...appProps, ref: appRef }, child)
          )
        )
      }
    }
  }
  
  const App = NewAppComponent(entryComponent)

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
    },
    onPageNotFound: {
      enumerable: true,
      writable: true,
      value (options) {
        triggerAppLifecycle('onPageNotFound', options)
      }
    },
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
