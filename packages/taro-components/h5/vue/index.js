import Vue from 'vue'

import createComponent from './createComponent'
import createFormsComponent from './createFormsComponent'
import components from './components'

components.forEach(params => {
  if (typeof params === 'string') {
    Vue.component(params, createComponent(params))
  } else if (params instanceof Array) {
    const [name, props] = params
    const { classNames, type = 'simple' } = props

    if (type === 'simple') {
      Vue.component(name, createComponent(name, classNames))
    } else if (type === 'forms') {
      const { event, modelValue } = props
      Vue.component(name, createFormsComponent(name, event, modelValue, classNames))
    } else if (type === 'component') {
      Vue.component(name, props.component)
    }
  }
})

Vue.config.ignoredElements = [
  'root',
  'block',
  /^taro-/
]
