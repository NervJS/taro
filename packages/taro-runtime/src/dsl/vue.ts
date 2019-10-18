import { Current } from '../current'
import VueCtor, { ComponentOptions, VueConstructor } from 'vue'
import { injectPageInstance } from '../config/create_page'

export function connectVuePage (derivedIDfromCompiler: string, Vue: VueConstructor) {
  return (component: ComponentOptions<VueCtor>) => {
    const injectedComp = Vue.extend({
      mixins: [component, {
        created () {
          injectPageInstance(derivedIDfromCompiler, this.$options)
        }
      }]
    })

    const options: ComponentOptions<VueCtor> = {
      render (h) {
        return h('page', [
          Current.pages.has(derivedIDfromCompiler) && h(
            'root',
            {
              attrs: {
                id: derivedIDfromCompiler
              },
              key: 'stable'
            },
            [
              h(injectedComp)
            ]
          )
        ])
      },
      created () {
        // Vue 的 forceUpdate 不会更新子组件，切换手动挡
        Current.roots.add(this)
      }
    }

    return options
  }
}

export function updateVuePages (cb: () => void) {
  Current.roots.forEach(inst => {
    inst.$forceUpdate!()
  })

  Current.app!.$nextTick!(cb)
}
