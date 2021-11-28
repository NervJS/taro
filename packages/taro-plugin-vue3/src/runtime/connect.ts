import { isFunction, ensure, isArray } from '@tarojs/shared'
import {
  container,
  SERVICE_IDENTIFIER,
  Current,
  injectPageInstance
} from '@tarojs/runtime'
import { setDefaultDescriptor, setRouterParams } from './utils'

import type {
  App,
  Component,
  ComponentPublicInstance,
  VNode,
  h as createElement
} from '@vue/runtime-core'
import type { AppConfig as Config } from '@tarojs/taro'
import type { IHooks, AppInstance, TaroElement } from '@tarojs/runtime'

function setReconciler () {
  const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

  hooks.getLifecycle = function (instance, lifecycle) {
    return instance.$options[lifecycle]
  }

  hooks.modifyMpEventImpls?.push(function (event) {
    event.type = event.type.replace(/-/g, '')
  })

  if (process.env.TARO_ENV === 'h5') {
    hooks.createPullDownComponent = (component, path, h: typeof createElement) => {
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
    }

    hooks.getDOMNode = (el) => {
      return el.$el as any
    }
  }
}

function createVue3Page (h: typeof createElement, id: string) {
  return function (component): VNode {
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
      provide: { id },
      render () {
        return this.$slots.default()
      }
    }
    const RootElement = process.env.TARO_ENV === 'h5' ? 'div' : 'root'
    const PageComponent = Object.assign({}, component)

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
                h(PageComponent, { tid: id })
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

  ensure(!isFunction(app._component), '入口组件不支持使用函数式组件')

  setReconciler()

  app._component.render = function () {
    return pages.slice()
  }

  if (process.env.TARO_ENV !== 'h5') {
    appInstance = app.mount('#app')
  }

  const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)
  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.getMiniLifecycleImpl().app

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
          appInstance = app.mount('#app')
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
    })
  })

  Current.app = appConfig

  return appConfig
}
