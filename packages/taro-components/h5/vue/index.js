import Vue from 'vue'
import createComponent from './createComponent'
import createFormsComponent from './createFormsComponent'
import Picker from './components/picker'
import Text from './components/text'
import Image from './components/image'
import Icon from './components/icon'
import ScrollView from './components/scroll-view'

import { simpleComponents } from './simpleComponents'

simpleComponents.map(component => {
  if (typeof component === 'string') {
    Vue.component(component, createComponent(component))
  } else {
    const { name, classNames } = component
    Vue.component(name, createComponent(name, classNames))
  }
})

const Input = createFormsComponent('taro-input', 'input')
const Textarea = createFormsComponent('taro-textarea', 'input')
const Switch = createFormsComponent('taro-switch', 'change', 'checked')
const Slider = createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box'])

Vue.component('taro-input', Input)
Vue.component('taro-textarea', Textarea)
Vue.component('taro-switch', Switch)
Vue.component('taro-slider', Slider)
Vue.component('taro-text', Text)
Vue.component('taro-picker', Picker)
Vue.component('taro-image', Image)
Vue.component('taro-icon', Icon)
Vue.component('taro-scroll-view', ScrollView)

Vue.config.ignoredElements = [
  'root',
  'block',
  /^taro-/
]
