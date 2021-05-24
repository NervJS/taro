import { isFunction, noop, ensure, isBoolean } from '@tarojs/shared'
import container from '../container'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { injectPageInstance } from './common'
import { Current } from '../current'
import { document } from '../bom/document'
import { isBrowser } from '../env'

/* eslint-disable import/no-duplicates */
import type VueCtor from 'vue'
import type { ComponentOptions, VueConstructor, VNode } from 'vue'
import type { AppConfig } from '@tarojs/taro'
import type { AppInstance, VueAppInstance, VueInstance } from './instance'
import type { IHooks } from '../interface'

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

function setReconciler () {
  const hooks = container.get<IHooks>(SERVICE_IDENTIFIER.Hooks)

  const onRemoveAttribute = function (dom, qualifiedName) {
    // 处理原因: https://github.com/NervJS/taro/pull/5990
    const props = dom.props
    if (!props.hasOwnProperty(qualifiedName) || isBoolean(props[qualifiedName])) {
      dom.setAttribute(qualifiedName, false)
      return true
    }
  }

  const getLifecycle = function (instance, lifecycle) {
    return instance.$options[lifecycle]
  }

  hooks.onRemoveAttribute = onRemoveAttribute
  hooks.getLifecycle = getLifecycle

  if (process.env.TARO_ENV === 'h5') {
    hooks.createPullDownComponent = (el, path, vue: VueConstructor) => {
      const injectedPage = vue.extend({
        props: {
          tid: String
        },
        mixins: [el as ComponentOptions<Vue>, {
          created () {
            injectPageInstance(this, path)
          }
        }]
      })

      const options: ComponentOptions<Vue> = {
        name: 'PullToRefresh',
        render (h) {
          return h(
            'taro-pull-to-refresh',
            {
              class: ['hydrated']
            },
            [h(injectedPage, this.$slots.default)]
          )
        }
      }

      return options
    }

    hooks.getDOMNode = (el) => {
      return el.$el as any
    }
  }
}

let Vue

export function createVueApp (App: ComponentOptions<VueCtor>, vue: V, config: AppConfig) {
  Vue = vue
  ensure(!!Vue, '构建 Vue 项目请把 process.env.FRAMEWORK 设置为 \'vue\'')

  setReconciler()

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
      return h(App, { ref: 'app' }, elements.slice())
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

  const app: AppInstance = Object.create({
    mount (component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
      const page = connectVuePage(Vue, id)(component)
      wrapper.mount(page, id, cb)
    },

    unmount (id: string, cb: () => void) {
      wrapper.unmount(id, cb)
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
        wrapper.$mount(document.getElementById('app') as any)
        appInstance = wrapper.$refs.app as VueAppInstance
        if (appInstance != null && isFunction(appInstance.$options.onLaunch)) {
          appInstance.$options.onLaunch.call(appInstance, options)
        }
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
        if (appInstance != null && isFunction(appInstance.$options.onShow)) {
          appInstance.$options.onShow.call(appInstance, options)
        }
      }
    },

    onHide: {
      writable: true,
      enumerable: true,
      value (options) {
        if (appInstance != null && isFunction(appInstance.$options.onHide)) {
          appInstance.$options.onHide.call(appInstance, options)
        }
      }
    }
  })

  Current.app = app

  return Current.app
}
