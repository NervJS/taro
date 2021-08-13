import { Shortcuts } from './shortcuts'

export const styles = {
  style: `i.${Shortcuts.Style}`,
  class: `i.${Shortcuts.Class}`
}

export const events = {
  bindtap: 'eh'
}

export const touchEvents = {
  bindTouchStart: '',
  bindTouchMove: '',
  bindTouchEnd: '',
  bindTouchCancel: '',
  bindLongTap: ''
}

export const animationEvents = {
  bindAnimationStart: '',
  bindAnimationIteration: '',
  bindAnimationEnd: '',
  bindTransitionEnd: ''
}

export function singleQuote (s: string) {
  return `'${s}'`
}

const View = {
  'hover-class': singleQuote('none'),
  'hover-stop-propagation': 'false',
  'hover-start-time': '50',
  'hover-stay-time': '400',
  animation: '',
  ...touchEvents,
  ...animationEvents
}

const Icon = {
  type: '',
  size: '23',
  color: ''
}

const MapComp = {
  longitude: '',
  latitude: '',
  scale: '16',
  markers: '[]',
  covers: '',
  polyline: '[]',
  circles: '[]',
  controls: '[]',
  'include-points': '[]',
  'show-location': '',
  'layer-style': '1',
  bindMarkerTap: '',
  bindControlTap: '',
  bindCalloutTap: '',
  bindUpdated: '',
  ...touchEvents
}

const Progress = {
  percent: '',
  'stroke-width': '6',
  color: singleQuote('#09BB07'),
  activeColor: singleQuote('#09BB07'),
  backgroundColor: singleQuote('#EBEBEB'),
  active: 'false',
  'active-mode': singleQuote('backwards'),
  'show-info': 'false'
}

const RichText = {
  nodes: '[]'
}

const Text = {
  selectable: 'false',
  space: '',
  decode: 'false'
}

const Button = {
  size: singleQuote('default'),
  type: '',
  plain: 'false',
  disabled: '',
  loading: 'false',
  'form-type': '',
  'open-type': '',
  'hover-class': singleQuote('button-hover'),
  'hover-stop-propagation': 'false',
  'hover-start-time': '20',
  'hover-stay-time': '70',
  name: ''
}

const Checkbox = {
  value: '',
  disabled: '',
  checked: 'false',
  color: singleQuote('#09BB07'),
  name: ''
}

const CheckboxGroup = {
  bindChange: '',
  name: ''
}

const Form = {
  'report-submit': 'false',
  bindSubmit: '',
  bindReset: '',
  name: ''
}

const Input = {
  value: '',
  type: singleQuote(''),
  password: 'false',
  placeholder: '',
  'placeholder-style': '',
  'placeholder-class': singleQuote('input-placeholder'),
  disabled: '',
  maxlength: '140',
  'cursor-spacing': '0',
  focus: 'false',
  'confirm-type': singleQuote('done'),
  'confirm-hold': 'false',
  cursor: 'i.value.length',
  'selection-start': '-1',
  'selection-end': '-1',
  bindInput: '',
  bindFocus: '',
  bindBlur: '',
  bindConfirm: '',
  name: ''
}

const Label = {
  for: '',
  name: ''
}

const Picker = {
  mode: singleQuote('selector'),
  disabled: '',
  range: '',
  'range-key': '',
  value: '',
  start: '',
  end: '',
  fields: singleQuote('day'),
  'custom-item': '',
  name: '',
  bindCancel: '',
  bindChange: '',
  bindColumnChange: ''
}

const PickerView = {
  value: '',
  'indicator-style': '',
  'indicator-class': '',
  'mask-style': '',
  'mask-class': '',
  bindChange: '',
  name: ''
}

const PickerViewColumn = {
  name: ''
}

const Radio = {
  value: '',
  checked: 'false',
  disabled: '',
  color: singleQuote('#09BB07'),
  name: ''
}

const RadioGroup = {
  bindChange: '',
  name: ''
}

const Slider = {
  min: '0',
  max: '100',
  step: '1',
  disabled: '',
  value: '0',
  activeColor: singleQuote('#1aad19'),
  backgroundColor: singleQuote('#e9e9e9'),
  'block-size': '28',
  'block-color': singleQuote('#ffffff'),
  'show-value': 'false',
  bindChange: '',
  bindChanging: '',
  name: ''
}

const Switch = {
  checked: 'false',
  disabled: '',
  type: singleQuote('switch'),
  color: singleQuote('#04BE02'),
  bindChange: '',
  name: ''
}

const Textarea = {
  value: '',
  placeholder: '',
  'placeholder-style': '',
  'placeholder-class': singleQuote('textarea-placeholder'),
  disabled: '',
  maxlength: '140',
  'auto-focus': 'false',
  focus: 'false',
  'auto-height': 'false',
  fixed: 'false',
  'cursor-spacing': '0',
  cursor: '-1',
  'selection-start': '-1',
  'selection-end': '-1',
  bindFocus: '',
  bindBlur: '',
  bindLineChange: '',
  bindInput: '',
  bindConfirm: '',
  name: ''
}

const CoverImage = {
  src: '',
  bindLoad: 'eh',
  bindError: 'eh'
}

const CoverView = {
  'scroll-top': 'false',
  ...touchEvents
}

const MovableArea = {
  'scale-area': 'false'
}

const MovableView = {
  direction: 'none',
  inertia: 'false',
  'out-of-bounds': 'false',
  x: '',
  y: '',
  damping: '20',
  friction: '2',
  disabled: '',
  scale: 'false',
  'scale-min': '0.5',
  'scale-max': '10',
  'scale-value': '1',
  animation: 'true',
  bindChange: '',
  bindScale: '',
  bindHTouchMove: '',
  bindVTouchMove: '',
  width: singleQuote('10px'),
  height: singleQuote('10px'),
  ...touchEvents,
  ...animationEvents
}

const ScrollView = {
  'scroll-x': 'false',
  'scroll-y': 'false',
  'upper-threshold': '50',
  'lower-threshold': '50',
  'scroll-top': '',
  'scroll-left': '',
  'scroll-into-view': '',
  'scroll-with-animation': 'false',
  'enable-back-to-top': 'false',
  bindScrollToUpper: '',
  bindScrollToLower: '',
  bindScroll: '',
  ...touchEvents,
  ...animationEvents
}

const Swiper = {
  'indicator-dots': 'false',
  'indicator-color': singleQuote('rgba(0, 0, 0, .3)'),
  'indicator-active-color': singleQuote('#000000'),
  autoplay: 'false',
  current: '0',
  interval: '5000',
  duration: '500',
  circular: 'false',
  vertical: 'false',
  'previous-margin': '\'0px\'',
  'next-margin': '\'0px\'',
  'display-multiple-items': '1',
  bindChange: '',
  bindTransition: '',
  bindAnimationFinish: '',
  ...touchEvents
}

const SwiperItem = {
  'item-id': ''
}

const Navigator = {
  url: '',
  'open-type': singleQuote('navigate'),
  delta: '1',
  'hover-class': singleQuote('navigator-hover'),
  'hover-stop-propagation': 'false',
  'hover-start-time': '50',
  'hover-stay-time': '600',
  bindSuccess: '',
  bindFail: '',
  bindComplete: ''
}

const Audio = {
  id: '',
  src: '',
  loop: 'false',
  controls: 'false',
  poster: '',
  name: '',
  author: '',
  bindError: '',
  bindPlay: '',
  bindPause: '',
  bindTimeUpdate: '',
  bindEnded: ''
}

const Camera = {
  'device-position': singleQuote('back'),
  flash: singleQuote('auto'),
  bindStop: '',
  bindError: ''
}

const Image = {
  src: '',
  mode: singleQuote('scaleToFill'),
  'lazy-load': 'false',
  bindError: '',
  bindLoad: '',
  ...touchEvents
}

const LivePlayer = {
  src: '',
  autoplay: 'false',
  muted: 'false',
  orientation: singleQuote('vertical'),
  'object-fit': singleQuote('contain'),
  'background-mute': 'false',
  'min-cache': '1',
  'max-cache': '3',
  animation: '',
  bindStateChange: '',
  bindFullScreenChange: '',
  bindNetStatus: ''
}

const Video = {
  src: '',
  duration: '',
  controls: 'true',
  'danmu-list': '',
  'danmu-btn': '',
  'enable-danmu': '',
  autoplay: 'false',
  loop: 'false',
  muted: 'false',
  'initial-time': '0',
  'page-gesture': 'false',
  direction: '',
  'show-progress': 'true',
  'show-fullscreen-btn': 'true',
  'show-play-btn': 'true',
  'show-center-play-btn': 'true',
  'enable-progress-gesture': 'true',
  'object-fit': singleQuote('contain'),
  poster: '',
  'show-mute-btn': 'false',
  animation: '',
  bindPlay: '',
  bindPause: '',
  bindEnded: '',
  bindTimeUpdate: '',
  bindFullScreenChange: '',
  bindWaiting: '',
  bindError: ''
}

const Canvas = {
  'canvas-id': '',
  'disable-scroll': 'false',
  bindError: '',
  ...touchEvents
}

const Ad = {
  'unit-id': '',
  'ad-intervals': '',
  bindLoad: '',
  bindError: '',
  bindClose: ''
}

const WebView = {
  src: '',
  bindMessage: '',
  bindLoad: '',
  bindError: ''
}

const Block = {}

// For Vue，因为 slot 标签被 vue 占用了
const SlotView = {
  name: ''
}

// For React
// Slot 和 SlotView 最终都会编译成 <view slot={{ i.name }} />
// 因为 <slot name="{{ i.name }}" /> 适用性没有前者高（无法添加类和样式）
// 不给 View 直接加 slot 属性的原因是性能损耗
const Slot = {
  name: ''
}

export const internalComponents: Record<string, Record<string, string>> = {
  View,
  Icon,
  Progress,
  RichText,
  Text,
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  Label,
  Picker,
  PickerView,
  PickerViewColumn,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  CoverImage,
  Textarea,
  CoverView,
  MovableArea,
  MovableView,
  ScrollView,
  Swiper,
  SwiperItem,
  Navigator,
  Audio,
  Camera,
  Image,
  LivePlayer,
  Video,
  Canvas,
  Ad,
  WebView,
  Block,
  Map: MapComp,
  Slot,
  SlotView
}

export const controlledComponent = new Set([
  'input',
  'checkbox',
  'picker',
  'picker-view',
  'radio',
  'slider',
  'switch',
  'textarea'
])

export const focusComponents = new Set([
  'input',
  'textarea'
])

export const voidElements = new Set([
  'progress',
  'icon',
  'rich-text',
  'input',
  'textarea',
  'slider',
  'switch',
  'audio',
  'ad',
  'official-account',
  'open-data',
  'navigation-bar'
])

export const nestElements = new Map([
  ['view', -1],
  ['catch-view', -1],
  ['cover-view', -1],
  ['static-view', -1],
  ['pure-view', -1],
  ['block', -1],
  ['text', -1],
  ['static-text', 6],
  ['slot', 8],
  ['slot-view', 8],
  ['label', 6],
  ['form', 4],
  ['scroll-view', 4],
  ['swiper', 4],
  ['swiper-item', 4]
])
