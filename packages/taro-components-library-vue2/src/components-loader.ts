import Vue from 'vue'
import Fragment from 'vue-fragment'

import type { ExtendedVue } from 'vue/types/vue'

type TComponents = ExtendedVue<Vue, unknown, unknown, unknown, Record<string, unknown>>

export function initVue2Components (components: Record<string, TComponents> = {}) {
  const ignoredElements = [/^taro-/, 'root', 'block']
  if (!Vue.config.ignoredElements?.includes(ignoredElements[0])) {
    Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...ignoredElements]
  }

  Vue.use(Fragment.Plugin)
  Object.entries(components).forEach(([name, definition]) => {
    if (typeof definition === 'function') {
      const tagName = 'taro' + name.replace(new RegExp('([A-Z])', 'g'), '-$1').toLowerCase()
      Vue.component(tagName, definition)
    }
  })
}
