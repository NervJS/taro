import { isFunction, ensure, isArray } from '@tarojs/shared'
import {
  container,
  SERVICE_IDENTIFIER,
  Current,
  safeExecute,
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

  hooks.modifyMpEvent = function (event) {
    event.type = event.type.replace(/-/g, '')
  }

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
        // vue3 组件 created 时机比小程序页面 onShow 慢，因此在 created 后再手动触发一次 onShow。
        this.$nextTick(() => {
          safeExecute(id, 'onShow')
        })
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

    return h(
      process.env.TARO_ENV === 'h5' ? 'div' : 'root',
      {
        key: id,
        id,
        class: process.env.TARO_ENV === 'h5' ? 'taro_page' : ''
      },
      [
        h(Object.assign({}, component), {
          tid: id
        })
      ]
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

    onLaunch: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)
        if (process.env.TARO_ENV === 'h5') {
          appInstance = app.mount('#app')
        }
        const onLaunch = appInstance?.$options?.onLaunch
        isFunction(onLaunch) && onLaunch.call(appInstance, options)
      }
    }),

    onShow: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)
        const onShow = appInstance?.$options?.onShow
        isFunction(onShow) && onShow.call(appInstance, options)
      }
    }),

    onHide: setDefaultDescriptor({
      value (options) {
        const onHide = appInstance?.$options?.onHide
        isFunction(onHide) && onHide.call(appInstance, options)
      }
    })
  })

  Current.app = appConfig

  return appConfig
}
