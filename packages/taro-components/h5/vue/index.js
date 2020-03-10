import Vue from 'vue'
import createComponent from './createComponent'
import Input from './components/input.vue'
import Picker from './components/picker.vue'

import {
  INPUT,
  PICKER,
  components
} from './constant'

components.map(component => {
  Vue.component(component, createComponent(component))
})
Vue.component(INPUT, Input)
Vue.component(PICKER, Picker)
