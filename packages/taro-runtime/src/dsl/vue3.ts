import { isFunction } from '@tarojs/shared'
import { AppInstance } from './instance'
import { Current } from '../current'
import { injectPageInstance } from './common'
import { isBrowser } from '../env'
import { setReconciler } from './vue'

import type {
  App,
  Component,
  ComponentPublicInstance,
  VNode,
  h as createElement
} from '@vue/runtime-core'
import type { TaroElement } from '../dom/element'
import type { AppConfig as Config } from '@tarojs/taro'

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
    component.mixins = Array.isArray(component.mixins)
      ? component.mixins.push(inject)
      : [inject]

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

export function createVue3App (app: App<TaroElement>, h: typeof createElement, config: Config) {
  let pages: VNode[] = []
  let appInstance: ComponentPublicInstance

  if (typeof app._component === 'function') {
    throw new Error('入口组件不支持使用函数式组件')
  }

  setReconciler()

  app._component.render = function () {
    return pages.slice()
  }

  class AppConfig implements AppInstance {
    config = config

    onLaunch (options) {
      Current.router = {
        params: options?.query,
        ...options
      }
      appInstance = app.mount('#app')
      const onLaunch = appInstance?.$options?.onLaunch
      isFunction(onLaunch) && onLaunch.call(appInstance, options)
    }

    onShow (options) {
      Current.router = {
        params: options?.query,
        ...options
      }
      const onShow = appInstance?.$options?.onShow
      isFunction(onShow) && onShow.call(appInstance, options)
    }

    onHide (options: unknown) {
      const onHide = appInstance?.$options?.onHide
      isFunction(onHide) && onHide.call(appInstance, options)
    }

    mount = (component: Component, id: string, cb: () => void) => {
      const page = createVue3Page(h, id)(component)
      pages.push(page)
      this.updateAppInstance(cb)
    }

    unmount = (id: string, cb: () => void) => {
      pages = pages.filter(page => page.key !== id)
      this.updateAppInstance(cb)
    }

    updateAppInstance (cb?: (() => void | undefined)) {
      appInstance.$forceUpdate()
      appInstance.$nextTick(cb)
    }
  }

  Current.app = new AppConfig()

  return Current.app
}
