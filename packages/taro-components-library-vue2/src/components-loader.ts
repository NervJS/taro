import Vue from 'vue'
import Fragment from 'vue-fragment'

export function initVue2Components (components: Record<string, any> = {}) {
  const ignoredElements = [/^taro-/, 'root', 'block']
  if (!Vue.config.ignoredElements?.includes(ignoredElements[0])) {
    Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...ignoredElements]
  }

  Vue.use(Fragment.Plugin)
  Object.entries(components).forEach(([name, definition]) => {
    if (typeof definition?.render === 'function') {
      const tagName = 'taro' + name.replace(new RegExp('([A-Z])', 'g'), '-$1').toLowerCase()
      const comp = Vue.extend(definition)
      Vue.component(tagName, comp)
    }
  })
}
