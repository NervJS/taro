import * as components from './components'

export * from './components'

export function initVue3Components (app) {
  app.config.isCustomElement = tag => /^taro-/.test(tag) || tag === 'root' || tag === 'block'

  Object.keys(components).forEach(name => {
    if (components.hasOwnProperty(name)) {
      const tagName = 'taro-' + name.replace(/(?<=[a-z])([A-Z])/g, '-$1').toLowerCase()
      const component = components[name]
      if (component) {
        app.component(tagName, component)
      }
    }
  })
}
