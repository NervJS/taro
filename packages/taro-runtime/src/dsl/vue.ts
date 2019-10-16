import { Current } from '../current'
import Vue, { Component as VueComponent, ComponentOptions } from 'vue'

export function connectVuePage (derivedIDfromCompiler: string) {
  return (component: VueComponent) => {
    const options: ComponentOptions<Vue> = {
      render (h) {
        return h(
          'root',
          {
            attrs: {
              id: derivedIDfromCompiler
            }
          },
          [Current.pages.has(derivedIDfromCompiler) && h(component, { key: 'a' })]
        )
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
