import { h } from 'vue'

import { IS_VUE3 } from '../../../utils/constants'

export default function (componentName: string, options?: Record<string, any>, children?: any) {
  const { attrs = {}, on = {}, props = {}, ...el } = options
  // Events
  if (IS_VUE3) {
    Object.keys(on).forEach(key => {
      const name = `on${key.charAt(0).toUpperCase()}${key.slice(1)}`
      el[name] = on[key]
    })
    return h(componentName, { ...attrs, ...props, ... el }, children)
  }
  return h(componentName, options, children)
}
