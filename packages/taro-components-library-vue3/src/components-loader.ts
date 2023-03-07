export function initVue3Components (app, components: Record<string, any> = {}) {
  app.config.isCustomElement = tag => /^taro-/.test(tag) || tag === 'root' || tag === 'block'

  Object.entries(components).forEach(([name, component]) => {
    const tagName = component?.displayName
    if (typeof tagName === 'string' && tagName) {
      component.name = name
      app.component(tagName.replace(/-core$/, ''), component)
    }
  })
}
