import {
  Current,
  document,
  getPath,
  injectPageInstance
} from '@tarojs/runtime'
import { ensure, hooks, isBoolean, isFunction, isWebPlatform, noop } from '@tarojs/shared'

import { setDefaultDescriptor, setRouterParams } from './utils'

import type { AppInstance, VueAppInstance, VueInstance } from '@tarojs/runtime'
import type { AppConfig } from '@tarojs/taro'
/* eslint-disable import/no-duplicates */
import type VueCtor from 'vue'
import type { ComponentOptions, CreateElement, VNode, VueConstructor } from 'vue'

export type V = typeof VueCtor

let Vue
const isWeb = isWebPlatform()

function setReconciler () {
  hooks.tap('onRemoveAttribute', function (dom, qualifiedName) {
    // 处理原因: https://github.com/NervJS/taro/pull/5990
    const props = dom.props
    if (!props.hasOwnProperty(qualifiedName) || isBoolean(props[qualifiedName])) {
      dom.setAttribute(qualifiedName, false)
      return true
    }
    return false
  })

  hooks.tap('getLifecycle', function (instance, lifecycle) {
    return instance.$options[lifecycle]
  })

  if (isWeb) {
    hooks.tap('createPullDownComponent', (el, path, vue: VueConstructor, _, stampId: string) => {
      const injectedPage = vue.extend({
        props: {
          tid: String
        },
        mixins: [el as ComponentOptions<VueCtor>, {
          created () {
            const pagePath = stampId ? getPath(path, { stamp: stampId }) : path
            
            injectPageInstance(this, pagePath)
          }
        }]
      })

      const options: ComponentOptions<VueCtor> = {
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
    })

    hooks.tap('getDOMNode', el => {
      return el.$el as any
    })
  }
}

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
          isWeb ? 'div' : 'root',
          {
            attrs: {
              id,
              class: isWeb ? 'taro_page' : ''
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

export function createVueApp (App: ComponentOptions<VueCtor>, vue: V, config: AppConfig) {
  if (process.env.NODE_ENV !== 'production') {
    ensure(!!vue, '构建 Vue 项目请把 process.env.FRAMEWORK 设置为 \'vue\'')
  }

  Vue = vue
  Vue.config.getTagNamespace = noop
  const elements: VNode[] = []
  const pages: Array<(h: CreateElement) => VNode> = []
  let appInstance: VueAppInstance

  setReconciler()

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

  if (!isWeb) {
    wrapper.$mount(document.getElementById('app') as any)
  }

  const [ONLAUNCH, ONSHOW, ONHIDE] = hooks.call('getMiniLifecycleImpl')!.app

  const appObj: AppInstance = Object.create({
    mount (component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
      const page = connectVuePage(Vue, id)(component)
      wrapper.mount(page, id, cb)
    },

    unmount (id: string, cb: () => void) {
      wrapper.unmount(id, cb)
    }
  }, {
    config: setDefaultDescriptor({
      configurable: true,
      value: config
    }),

    [ONLAUNCH]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)

        if (isWeb) {
          // 由于 H5 路由初始化的时候会清除 app 下的 dom 元素，所以需要在路由初始化后再执行 render
          wrapper.$mount(document.getElementById(config?.appId || 'app') as any)
        }

        appInstance = wrapper.$refs.app as VueAppInstance
        if (appInstance != null && isFunction(appInstance.$options.onLaunch)) {
          appInstance.$options.onLaunch.call(appInstance, options)
        }
      }
    }),

    [ONSHOW]: setDefaultDescriptor({
      value (options) {
        setRouterParams(options)

        if (appInstance != null && isFunction(appInstance.$options.onShow)) {
          appInstance.$options.onShow.call(appInstance, options)
        }
      }
    }),

    [ONHIDE]: setDefaultDescriptor({
      value (options) {
        if (appInstance != null && isFunction(appInstance.$options.onHide)) {
          appInstance.$options.onHide.call(appInstance, options)
        }
      }
    }),

    onError: setDefaultDescriptor({
      value (error) {
        if (appInstance != null && isFunction(appInstance.$options.onError)) {
          appInstance.$options.onError.call(appInstance, error)
        }
      }
    }),

    onUnhandledRejection: setDefaultDescriptor({
      value (error) {
        if (appInstance != null && isFunction(appInstance.$options.onUnhandledRejection)) {
          appInstance.$options.onUnhandledRejection.call(appInstance, error)
        }
      }
    }),

    onPageNotFound: setDefaultDescriptor({
      value (res) {
        if (appInstance != null && isFunction(appInstance.$options.onPageNotFound)) {
          appInstance.$options.onPageNotFound.call(appInstance, res)
        }
      }
    })
  })

  Current.app = appObj

  return appObj
}
