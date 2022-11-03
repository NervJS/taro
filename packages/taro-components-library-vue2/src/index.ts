import Vue from 'vue'
import { ExtendedVue } from 'vue/types/vue'

import * as components from './components'

export function initVue2Components () {
  const ignoredElements = [/^taro-/, 'root', 'block']
  if (!Vue.config.ignoredElements?.includes(ignoredElements[0])) {
    Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...ignoredElements]
  }
  Object.entries(components).forEach(params => {
    const [name, definition] = params as [string, ExtendedVue<Vue, unknown, unknown, unknown, Record<string, unknown>>]
    if (definition) {
      const tagName = 'taro' + name.replace(new RegExp('([A-Z])', 'g'), '-$1').toLowerCase()
      Vue.component(tagName, definition)
    }
  })
}

export * from './components'
