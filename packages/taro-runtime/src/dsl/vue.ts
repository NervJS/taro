/* eslint-disable import/no-duplicates */
import type { ComponentOptions, VueConstructor, VNode } from 'vue'
import type VueCtor from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppConfig } from '@tarojs/taro'
import { AppInstance, VueAppInstance, VueInstance } from './instance'
import { injectPageInstance } from './common'
import { Current } from '../current'
import { document } from '../bom/document'
import { isFunction, noop, ensure } from '@tarojs/shared'
import { isBrowser } from '../env'

export type V = typeof VueCtor

export function connectVuePage (Vue: VueConstructor, id: string) {
  return (component: ComponentOptions<VueCtor>) => {
    const injectedPage = Vue.extend({
      props: {
        tid: String
      },
      mixins: [component, {
        created () {
          injectPageInstance(this, id)
        }
      }]
    })

    const options: ComponentOptions<VueCtor> = {
      render (h) {
        return h(
          isBrowser ? 'div' : 'root',
          {
            attrs: {
              id,
              class: isBrowser ? 'taro_page' : ''
            }
          },
          [
            h(injectedPage, { props: { tid: id } })
          ]
        )
      }
    }

    return options
  }
}

let Vue

export function createVueApp (App: VueInstance, vue: V, config: AppConfig) {
  Vue = vue
  ensure(!!Vue, '构建 Vue 项目请把 process.env.FRAMEWORK 设置为 \'vue\'')

  Vue.config.getTagNamespace = noop

  const elements: VNode[] = []
  const pages: Array<(h: Vue.CreateElement) => VNode> = []
  let appInstance: VueAppInstance

  const wrapper = new (Vue as VueConstructor)({
    render (h) {
      while (pages.length > 0) {
        const page = pages.pop()!
        elements.push(page(h))
      }
      return h(App.$options, { ref: 'app' }, elements.slice())
    },
    methods: {
      mount (component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
        pages.push((h) => h(component, { key: id }))
        this.updateSync(cb)
      },
      updateSync (this: VueInstance, cb: () => void) {
        this._update(this._render(), false)
        this.$children.forEach((child: VueInstance) => child._update(child._render(), false))
        cb()
      },
      unmount (id: string, cb: () => void) {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          if (element.key === id) {
            elements.splice(i, 1)
            break
          }
        }

        this.updateSync(cb)
      }
    }
  })

  class AppConfig implements AppInstance {
    config = config

    onLaunch (options) {
      wrapper.$mount(document.getElementById('app') as any)
      appInstance = wrapper.$refs.app as VueAppInstance
      Current.router = {
        params: options?.query,
        ...options
      }
      if (appInstance != null && isFunction(appInstance.$options.onLaunch)) {
        appInstance.$options.onLaunch.call(appInstance, options)
      }
    }

    onShow (options) {
      Current.router = {
        params: options?.query,
        ...options
      }
      if (appInstance != null && isFunction(appInstance.$options.onShow)) {
        appInstance.$options.onShow.call(appInstance, options)
      }
    }

    onHide (options: unknown) {
      if (appInstance != null && isFunction(appInstance.$options.onHide)) {
        appInstance.$options.onHide.call(appInstance, options)
      }
    }

    mount (component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
      const page = connectVuePage(Vue, id)(component)
      wrapper.mount(page, id, cb)
    }

    unmount (id: string, cb: () => void) {
      wrapper.unmount(id, cb)
    }
  }

  Current.app = new AppConfig()

  return Current.app
}
