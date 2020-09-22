import createComponent from './createComponent'
import { simpleComponents } from '../vue/simpleComponents'
import createFormsComponent from './createFormsComponent'
import Text from './components/text'
import Image from './components/image'
import Icon from './components/icon'
import ScrollView from './components/scroll-view'

const componentMap = {}

function genSimpleComponents(components) {
  components.map(component => {
    if (typeof component === 'string') {
      componentMap[component] = createComponent(component)
    } else {
      const { name, classNames } = component
      componentMap[name] = createComponent(name, classNames)
    }
  })
}

genSimpleComponents(simpleComponents)

// simple components
export const View = componentMap['taro-view']
export const RichText = componentMap['taro-rich-text']
export const Button = componentMap['taro-button']
export const CheckboxGroup = componentMap['taro-checkbox-group']
export const Editor = componentMap['taro-editor']
export const Form = componentMap['taro-form']
export const Label = componentMap['taro-label']
export const PickerView = componentMap['taro-picker-view']
export const PickerViewColumn = componentMap['taro-picker-view-column']
export const CoverImage = componentMap['taro-cover-image']
export const CoverView = componentMap['taro-cover-view']
export const MoveableArea = componentMap['taro-moveable-area']
export const MoveableView = componentMap['taro-moveable-view']
export const Swiper = componentMap['taro-swiper']
export const FunctionalPageNavigator = componentMap['taro-functional-page-navigator']
export const Navigator = componentMap['taro-navigator']
export const Audio = componentMap['taro-audio']
export const Camera = componentMap['taro-camera']
export const LivePlayer = componentMap['taro-live-player']
export const Map = componentMap['taro-map']
export const Ad = componentMap['taro-ad']
export const OfficialAccount = componentMap['taro-official-account']
export const OpenData = componentMap['taro-open-data']
export const WebView = componentMap['taro-web-view']
export const NavigationBar = componentMap['taro-navigation-bar']
export const Block = componentMap['taro-block']
export const Canvas = componentMap['taro-canvas']

// simple components with classNames
export const Checkbox = componentMap['taro-checkbox']
export const Progress = componentMap['taro-progress']
export const RadioGroup = componentMap['taro-radio-group']
export const Radio = componentMap['taro-radio']
export const SwiperItem = componentMap['taro-swiper-item']
export const Video = componentMap['taro-video']

// Form components
export const Input = createFormsComponent('taro-input', 'input')
export const Textarea = createFormsComponent('taro-textarea', 'input')
export const Picker = createFormsComponent('taro-picker', 'change')
export const Switch = createFormsComponent('taro-switch', 'change', 'checked')
export const Slider = createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box'])

export function initVue3Components(app) {
  app.config.isCustomElement = tag => /^taro-/.test(tag) || tag === 'root' || tag === 'block'

  simpleComponents.map(component => {
    app.component(component, componentMap[component])
  })

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

export {
  // others
  Text,
  Image,
  Icon,
  ScrollView
}
