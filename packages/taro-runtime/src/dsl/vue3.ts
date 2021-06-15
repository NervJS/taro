import { isFunction, isArray, ensure } from '@tarojs/shared'
import container from '../container'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { Current } from '../current'
import { injectPageInstance, safeExecute } from './common'
import { isBrowser } from '../env'

import type {
  App,
  Component,
  ComponentPublicInstance,
  VNode,
  h as createElement
} from '@vue/runtime-core'
import type { TaroElement } from '../dom/element'
import type { AppConfig as Config } from '@tarojs/taro'
import type { GetLifecycle, IHooks } from '../interface'
import type { AppInstance } from './instance'

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
      isBrowser ? 'div' : 'root',
      {
        key: id,
        id,
        class: isBrowser ? 'taro_page' : ''
      },
      [
        h(component, {
          tid: id
        })
      ]
    )
  }
}

function setReconciler () {
  const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

  const getLifecycle: GetLifecycle = function (instance, lifecycle) {
    return instance.$options[lifecycle]
  }

  const modifyMpEvent = function (event) {
    event.type = event.type.replace(/-/g, '')
  }

  hooks.getLifecycle = getLifecycle
  hooks.modifyMpEvent = modifyMpEvent

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

export function createVue3App (app: App<TaroElement>, h: typeof createElement, config: Config) {
  let pages: VNode[] = []
  let appInstance: ComponentPublicInstance

  ensure(!isFunction(app._component), '入口组件不支持使用函数式组件')

  setReconciler()

  app._component.render = function () {
    return pages.slice()
  }
  if (!isBrowser) {
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
    config: {
      writable: true,
      enumerable: true,
      configurable: true,
      value: config
    },

    onLaunch: {
      writable: true,
      enumerable: true,
      value (options) {
        Current.router = {
          params: options?.query,
          ...options
        }
        if (isBrowser) {
          appInstance = app.mount('#app')
        }
        const onLaunch = appInstance?.$options?.onLaunch
        isFunction(onLaunch) && onLaunch.call(appInstance, options)
      }
    },

    onShow: {
      writable: true,
      enumerable: true,
      value (options) {
        Current.router = {
          params: options?.query,
          ...options
        }
        const onShow = appInstance?.$options?.onShow
        isFunction(onShow) && onShow.call(appInstance, options)
      }
    },

    onHide: {
      writable: true,
      enumerable: true,
      value (options) {
        const onHide = appInstance?.$options?.onHide
        isFunction(onHide) && onHide.call(appInstance, options)
      }
    }
  })

  Current.app = appConfig

  return Current.app
}
