/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
    return class Entry extends React.Component <any, any> {
      render () {
        let props: React.Props<any> | null = null

        if (isReactComponent) {
          props = { ref }
        }
        const { initPath = '', initParams = {} } = this.props
        routerConfig.initPath = initPath
        routerConfig.initParams = initParams
        return React.createElement(TCNProvider, { ...this.props },
          React.createElement(AppCompoent, {
            ...props,
            ...this.props
          },
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
