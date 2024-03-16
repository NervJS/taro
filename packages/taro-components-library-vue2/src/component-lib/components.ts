import Icon from './icon'
import Image from './image'
import Picker from './picker'
import ScrollView from './scroll-view'
import Text from './text'

const components = [
  // 视图容器
  'taro-cover-image',
  'taro-cover-view',
  'taro-match-media',
  'taro-movable-area',
  'taro-movable-view',
  'taro-page-container',
  'taro-root-portal',
  ['taro-scroll-view', { type: 'component', component: ScrollView }],
  'taro-share-element',
  'taro-swiper',
  ['taro-swiper-item', { classNames: ['swiper-slide'] }],
  'taro-view',

  // 基础内容
  ['taro-icon', { type: 'component', component: Icon }],
  ['taro-progress', { classNames: ['weui-progress'] }],
  'taro-rich-text',
  ['taro-text', { type: 'component', component: Text }],

  // 表单组件
  'taro-button',
  ['taro-checkbox', { classNames: ['weui-cells_checkbox'] }],
  'taro-checkbox-group',
  'taro-editor',
  'taro-form',
  ['taro-input', { type: 'forms', event: 'input' }],
  'taro-keyboard-accessory',
  'taro-label',
  ['taro-picker', { type: 'component', component: Picker }],
  'taro-picker-view',
  'taro-picker-view-column',
  ['taro-radio', { classNames: ['weui-cells_checkbox'] }],
  ['taro-radio-group', { classNames: ['weui-cells_radiogroup'] }],
  ['taro-slider', { type: 'forms', event: 'change', modelValue: 'value', classNames: ['weui-slider-box'] }],
  ['taro-switch', { type: 'forms', event: 'change', modelValue: 'checked' }],
  ['taro-textarea', { type: 'forms', event: 'input' }],

  // 导航
  'taro-functional-page-navigator',
  'taro-navigator',

  // 媒体组件
  'taro-audio',
  'taro-camera',
  ['taro-image', { type: 'component', component: Image }],
  'taro-live-player',
  ['taro-video', { classNames: ['taro-video-container'] }],
  'taro-voip-room',

  // 地图
  'taro-map',

  // 画布
  'taro-canvas',

  // 开放能力
  'taro-web-view',
  'taro-ad',
  'taro-ad-custom',
  'taro-official-account',
  'taro-open-data',

  // 导航栏
  'taro-navigation-bar',

  // 页面属性配置节点
  'taro-page-meta',

  // 其他
  'taro-block',
  'taro-custom-wrapper',
  'taro-slot'
]

export default components
