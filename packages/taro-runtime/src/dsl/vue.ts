/* eslint-disable import/no-duplicates */
import type { ComponentOptions, VueConstructor, VNode } from 'vue'
import type VueCtor from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppConfig } from '@tarojs/taro'
import type { AppInstance, VueAppInstance, VueInstance } from './instance'
import { injectPageInstance } from './common'
import { Current } from '../current'
import { document } from '../bom/document'
import { isFunction, noop, ensure, capitalize, toCamelCase, internalComponents, hasOwn } from '@tarojs/shared'
import { isBrowser } from '../env'
import { options } from '../options'
import { isBooleanStringLiteral } from '@tarojs/shared'
import { Reconciler } from '../reconciler'

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
  const hostConfig: Reconciler<VueInstance> = {
    getLifecyle (instance, lifecycle) {
      return instance.$options[lifecycle]
    },
    removeAttribute (dom, qualifiedName) {
      const compName = capitalize(toCamelCase(dom.tagName.toLowerCase()))
      if (
        compName in internalComponents &&
        hasOwn(internalComponents[compName], qualifiedName) &&
        isBooleanStringLiteral(internalComponents[compName][qualifiedName])
      ) {
        // avoid attribute being removed because set false value in vue
        dom.setAttribute(qualifiedName, false)
      } else {
        delete dom.props[qualifiedName]
      }
    }
  }

  if (isBrowser) {
    hostConfig.createPullDownComponent = (el, path, vue: VueConstructor) => {
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
          return h('taro-pull-to-refresh', { class: ['hydrated'] }, [h(injectedPage, this.$slots.default)])
        }
      }

      return options
    }

    hostConfig.findDOMNode = (el) => {
      return el.$el as any
    }
  }

  options.reconciler(hostConfig)
}

let Vue

export function createVueApp (App: VueInstance, vue: V, config: AppConfig) {
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
