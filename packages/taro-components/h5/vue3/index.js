import * as components from './components'

export function initVue3Components (app) {
  app.config.isCustomElement = tag => /^taro-/.test(tag) || tag === 'root' || tag === 'block'

  Object.entries(components).forEach(([name, component]) => {
    if (component) {
      const tagName = 'taro' + name.replace(new RegExp('([A-Z])', 'g'), '-$1').toLowerCase()
      app.component(tagName, component)
    }
  })
}

export * from './components'
