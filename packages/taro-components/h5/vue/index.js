import Vue from 'vue'
import createComponent from './createComponent'
import Text from './components/text.vue'
import Input from './components/input.vue'
import Picker from './components/picker.vue'
import Image from './components/image.vue'
import Video from './components/video.vue'

import { simpleComponents } from './simpleComponents'

simpleComponents.map(component => {
  if (typeof component === 'string') {
    Vue.component(component, createComponent(component))
  } else {
    const { name, classNames } = component
    Vue.component(name, createComponent(name, classNames))
  }
})

Vue.component('taro-text', Text)
Vue.component('taro-input', Input)
Vue.component('taro-picker', Picker)
Vue.component('taro-image', Image)
Vue.component('taro-video', Video)

Vue.config.ignoredElements = [
  'root',
  'block',
  /^taro-/
]
