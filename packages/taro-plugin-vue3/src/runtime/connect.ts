/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import {
  Current,
  injectPageInstance
} from '@tarojs/runtime'
import { ensure, hooks, isArray, isFunction } from '@tarojs/shared'
import { provide } from 'vue'

import { setDefaultDescriptor, setRouterParams } from './utils'

import type { AppInstance, TaroElement } from '@tarojs/runtime'
import type { AppConfig as Config } from '@tarojs/taro'
import type {
  App,
  Component,
  ComponentOptions,
  ComponentPublicInstance,
  h as createElement,
  VNode
} from '@vue/runtime-core'

export function setReconciler () {
  hooks.tap('getLifecycle', function (instance, lifecycle) {
    return instance.$options[lifecycle]
  })

  if (process.env.TARO_ENV === 'h5') {
    hooks.tap('createPullDownComponent', (component, path, h: typeof createElement) => {
      const inject = {
        props: {
          tid: String
        },
        created () {
          injectPageInstance(this, path)
        }
      }

      component.mixins = isArray(component.mixins)
        ? component.mixins.push(inject)
        : [inject]

      return {
        render () {
          return h(
            'taro-pull-to-refresh',
            {
              class: 'hydrated'
            },
            [h(component, this.$slots.default)]
          )
        }
      }
    })

    hooks.tap('getDOMNode', el => {
      return el.$el as any
    })
  }
}

function createVue3Page (h: typeof createElement, id: string) {
  return function (component): VNode {
    // 处理类组件
    component = isClassComponent(component) ? component.__vccOpts : component
    const inject = {
      props: {
        tid: String
      },
      created () {
        injectPageInstance(this, id)
      }
    }

    if (isArray(component.mixins)) {
      const mixins = component.mixins
      const idx = mixins.length - 1
      if (!mixins[idx].props?.tid) {
        // mixins 里还没注入过，直接推入数组
        component.mixins.push(inject)
      } else {
        // mixins 里已经注入过，代替前者
        component.mixins[idx] = inject
      }
    } else {
      component.mixins = [inject]
    }

    const ProviderComponent = {
      setup () {
        provide('id', id)
      },
      render () {
        return this.$slots.default()
      }
    }
    const RootElement = process.env.TARO_ENV === 'h5' ? 'div' : 'root'
    const PageComponent = Object.assign({}, component)
    const option = PageComponent.props?.option?.default?.() || {}

    return h(
      ProviderComponent,
      {
        key: id
      },
      {
        default () {
          return [
            h(
              RootElement,
              {
                id,
                class: process.env.TARO_ENV === 'h5' ? 'taro_page' : ''
              },
              [
                h(PageComponent, { tid: id, option })
              ]
            )
          ]
        }
      }
    )
  }
}

export function createVue3App (app: App<TaroElement>, h: typeof createElement, config: Config) {
  let pages: VNode[] = []
  let appInstance: ComponentPublicInstance

  ensure(!(isFunction(app._component) && !isClassComponent(app._component)), '入口组件不支持使用函数式组件')

  setReconciler()

  ;(app._component as ComponentOptions).render = function () {
    return pages.slice()
  }

  if (process.env.TARO_ENV !== 'h5') {
    appInstance = app.mount('#app')
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.call('getMiniLifecycleImpl')!.app

  const appConfig: AppInstance = Object.create({
    mount (component: Component, id: string, cb: () => void) {
      const page = createVue3Page(h, id)(component)
      pages.push(page)
      this.updateAppInstance(cb)
    },

    unmount (id: string, cb: () => void) {
      pages = pages.filter(page => page.key !== id)
      this.updateAppInstance(cb)
    },

    updateAppInstance (cb?: (() => void | undefined)) {
      appInstance.$forceUpdate()
      appInstance.$nextTick(cb)
    }
  }, {
    config: setDefaultDescriptor({
      configurable: true,
      value: config
    }),

    [ONLAUNCH]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)
        if (process.env.TARO_ENV === 'h5') {
          appInstance = app.mount(`#${config.appId || 'app'}`)
        }

        // 把 App Class 上挂载的额外属性同步到全局 app 对象中
        // eslint-disable-next-line dot-notation
        if (app['taroGlobalData']) {
          // eslint-disable-next-line dot-notation
          const globalData = app['taroGlobalData']
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

        const onLaunch = appInstance?.$options?.onLaunch
        isFunction(onLaunch) && onLaunch.call(appInstance, options)
      }
    }),

    [ONSHOW]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)
        const onShow = appInstance?.$options?.onShow
        isFunction(onShow) && onShow.call(appInstance, options)
      }
    }),

    [ONHIDE]: setDefaultDescriptor({
      value (options) {
        const onHide = appInstance?.$options?.onHide
        isFunction(onHide) && onHide.call(appInstance, options)
      }
    }),

    onError: setDefaultDescriptor({
      value (error) {
        const onError = appInstance?.$options?.onError
        isFunction(onError) && onError.call(appInstance, error)
      }
    }),

    onUnhandledRejection: setDefaultDescriptor({
      value (error) {
        const onUnhandledRejection = appInstance?.$options?.onUnhandledRejection
        isFunction(onUnhandledRejection) && onUnhandledRejection.call(appInstance, error)
      }
    }),

    onPageNotFound: setDefaultDescriptor({
      value (res) {
        const onPageNotFound = appInstance?.$options?.onPageNotFound
        isFunction(onPageNotFound) && onPageNotFound.call(appInstance, res)
      }
    })
  })

  Current.app = appConfig

  return appConfig
}

export function isClassComponent (value: unknown) {
  return isFunction(value) && '__vccOpts' in value
}
