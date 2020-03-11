import Vue from 'vue'
import createComponent from './createComponent'
import Input from './components/input.vue'
import Picker from './components/picker.vue'

import { simpleComponents } from './simpleComponents'

simpleComponents.map(component => {
  if (typeof component === 'string') {
    Vue.component(component, createComponent(component))
  } else {
    const { name, classNames } = component
    Vue.component(name, createComponent(name, classNames))
  }
})
Vue.component('taro-input', Input)
Vue.component('taro-picker', Picker)
