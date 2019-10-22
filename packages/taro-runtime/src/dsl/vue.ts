import VueCtor, { ComponentOptions, VueConstructor, VNode } from 'vue'
import { AppInstance, VueAppInstance, VueInstance } from './instance'
// import { injectPageInstance } from './common'
import { Current } from '../current'
import { document } from '../bom/document'
import { isFunction } from '@tarojs/shared'

export function connectVuePage (Vue: VueConstructor, id: string) {
  return (component: ComponentOptions<VueCtor>) => {
    const injectedComp = Vue.extend({
      mixins: [component, {
        created (this: VueInstance) {
          // injectPageInstance(this.$options)
        }
      }]
    })

    const options: ComponentOptions<VueCtor> = {
      render (h) {
        return h(
          'root',
          {
            attrs: {
              id
            }
          },
          [
            h(injectedComp)
          ]
        )
      }
    }

    return options
  }
}

export function createVueApp (Vue: VueConstructor, App: VueInstance) {
  const elements: VNode[] = []
  const pages: Array<(h: Vue.CreateElement) => VNode> = []
  let appInstance: VueAppInstance

  const wrapper = new Vue({
    render (h) {
      while (pages.length > 0) {
        const page = pages.pop()!
        elements.push(page(h))
      }

      return h(App.$options, { ref: 'app' }, elements.slice())
    },
    methods: {
      mount (this: VueInstance, component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
        pages.push((h) => h(component, { key: id }))
        this.$forceUpdate()
        this.$nextTick(cb)
      },
      unmount (this: VueInstance, id: string, cb: () => void) {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          if (element.key === id) {
            elements.splice(i, 1)
            break
          }
        }

        this.$forceUpdate()
        this.$nextTick(cb)
      }
    }
  })

  // comp.$options

  class AppConfig implements AppInstance {
    onLaunch () {
      wrapper.$mount(document.getElementById('app') as any)
      appInstance = wrapper.$refs.app as VueAppInstance
    }

    onShow (options: unknown) {
      if (appInstance != null && isFunction(appInstance.$options.onShow)) {
        appInstance.$options.onShow(options)
      }
    }

    onHide (options: unknown) {
      if (appInstance != null && isFunction(appInstance.$options.onHide)) {
        appInstance.$options.onHide(options)
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
// export function updateVuePages (cb: () => void) {
//   Current.roots.forEach(inst => {
//     inst.$forceUpdate!()
//   })

//   // Current.app!.$nextTick!(cb)
// }
