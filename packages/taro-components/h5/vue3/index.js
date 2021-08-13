import createComponent from './createComponent'
import { simpleComponents } from '../vue/simpleComponents'
import createFormsComponent from './createFormsComponent'
import Text from './components/text'
import Image from './components/image'
import Icon from './components/icon'
import ScrollView from './components/scroll-view'

export function initVue3Components (app) {
  app.config.isCustomElement = tag => /^taro-/.test(tag) || tag === 'root' || tag === 'block'

  simpleComponents.map(component => {
    if (typeof component === 'string') {
      app.component(component, createComponent(component))
    } else {
      const { name, classNames } = component
      app.component(name, createComponent(name, classNames))
    }
  })

  const Input = createFormsComponent('taro-input', 'input')
  const Textarea = createFormsComponent('taro-textarea', 'input')
  const Picker = createFormsComponent('taro-picker', 'change')
  const Switch = createFormsComponent('taro-switch', 'change', 'checked')
  const Slider = createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box'])

  app.component('taro-input', Input)
  app.component('taro-textarea', Textarea)
  app.component('taro-picker', Picker)
  app.component('taro-switch', Switch)
  app.component('taro-slider', Slider)
  app.component('taro-text', Text)
  app.component('taro-image', Image)
  app.component('taro-icon', Icon)
  app.component('taro-scroll-view', ScrollView)
}
