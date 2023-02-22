/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

const DEFAULT_EMPTY_ARRAY = '[]'
const NO_DEFAULT_VALUE = ''
const DEFAULT_TRUE = '!0'
const DEFAULT_FALSE = '!1'

export const touchEvents = {
  bindTouchStart: NO_DEFAULT_VALUE,
  bindTouchMove: NO_DEFAULT_VALUE,
  bindTouchEnd: NO_DEFAULT_VALUE,
  bindTouchCancel: NO_DEFAULT_VALUE,
  bindLongTap: NO_DEFAULT_VALUE
}

export const animation = {
  animation: NO_DEFAULT_VALUE,
  bindAnimationStart: NO_DEFAULT_VALUE,
  bindAnimationIteration: NO_DEFAULT_VALUE,
  bindAnimationEnd: NO_DEFAULT_VALUE,
  bindTransitionEnd: NO_DEFAULT_VALUE
}

export function singleQuote (s: string) {
  return `'${s}'`
}

const View = {
  'hover-class': singleQuote('none'),
  'hover-stop-propagation': DEFAULT_FALSE,
  'hover-start-time': '50',
  'hover-stay-time': '400',
  ...touchEvents,
  ...animation
}

const Icon = {
  type: NO_DEFAULT_VALUE,
  size: '23',
  color: NO_DEFAULT_VALUE
}

const MapComp = {
  longitude: NO_DEFAULT_VALUE,
  latitude: NO_DEFAULT_VALUE,
  scale: '16',
  markers: DEFAULT_EMPTY_ARRAY,
  covers: NO_DEFAULT_VALUE,
  polyline: DEFAULT_EMPTY_ARRAY,
  circles: DEFAULT_EMPTY_ARRAY,
  controls: DEFAULT_EMPTY_ARRAY,
  'include-points': DEFAULT_EMPTY_ARRAY,
  'show-location': NO_DEFAULT_VALUE,
  'layer-style': '1',
  bindMarkerTap: NO_DEFAULT_VALUE,
  bindControlTap: NO_DEFAULT_VALUE,
  bindCalloutTap: NO_DEFAULT_VALUE,
  bindUpdated: NO_DEFAULT_VALUE,
  ...touchEvents
}

const Progress = {
  percent: NO_DEFAULT_VALUE,
  'stroke-width': '6',
  color: singleQuote('#09BB07'),
  activeColor: singleQuote('#09BB07'),
  backgroundColor: singleQuote('#EBEBEB'),
  active: DEFAULT_FALSE,
  'active-mode': singleQuote('backwards'),
  'show-info': DEFAULT_FALSE
}

const RichText = {
  nodes: DEFAULT_EMPTY_ARRAY
}

const Text = {
  selectable: DEFAULT_FALSE,
  space: NO_DEFAULT_VALUE,
  decode: DEFAULT_FALSE
}

const Button = {
  size: singleQuote('default'),
  type: NO_DEFAULT_VALUE,
  plain: DEFAULT_FALSE,
  disabled: NO_DEFAULT_VALUE,
  loading: DEFAULT_FALSE,
  'form-type': NO_DEFAULT_VALUE,
  'open-type': NO_DEFAULT_VALUE,
  'hover-class': singleQuote('button-hover'),
  'hover-stop-propagation': DEFAULT_FALSE,
  'hover-start-time': '20',
  'hover-stay-time': '70',
  name: NO_DEFAULT_VALUE,
  ...touchEvents
}

const Checkbox = {
  value: NO_DEFAULT_VALUE,
  disabled: NO_DEFAULT_VALUE,
  checked: DEFAULT_FALSE,
  color: singleQuote('#09BB07'),
  name: NO_DEFAULT_VALUE
}

const CheckboxGroup = {
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Form = {
  'report-submit': DEFAULT_FALSE,
  bindSubmit: NO_DEFAULT_VALUE,
  bindReset: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Input = {
  value: NO_DEFAULT_VALUE,
  type: singleQuote(NO_DEFAULT_VALUE),
  password: DEFAULT_FALSE,
  placeholder: NO_DEFAULT_VALUE,
  'placeholder-style': NO_DEFAULT_VALUE,
  'placeholder-class': singleQuote('input-placeholder'),
  disabled: NO_DEFAULT_VALUE,
  maxlength: '140',
  'cursor-spacing': '0',
  focus: DEFAULT_FALSE,
  'confirm-type': singleQuote('done'),
  'confirm-hold': DEFAULT_FALSE,
  cursor: 'i.value.length',
  'selection-start': '-1',
  'selection-end': '-1',
  bindInput: NO_DEFAULT_VALUE,
  bindFocus: NO_DEFAULT_VALUE,
  bindBlur: NO_DEFAULT_VALUE,
  bindConfirm: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Label = {
  for: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Picker = {
  mode: singleQuote('selector'),
  disabled: NO_DEFAULT_VALUE,
  range: NO_DEFAULT_VALUE,
  'range-key': NO_DEFAULT_VALUE,
  value: NO_DEFAULT_VALUE,
  start: NO_DEFAULT_VALUE,
  end: NO_DEFAULT_VALUE,
  fields: singleQuote('day'),
  'custom-item': NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE,
  bindCancel: NO_DEFAULT_VALUE,
  bindChange: NO_DEFAULT_VALUE,
  bindColumnChange: NO_DEFAULT_VALUE
}

const PickerView = {
  value: NO_DEFAULT_VALUE,
  'indicator-style': NO_DEFAULT_VALUE,
  'indicator-class': NO_DEFAULT_VALUE,
  'mask-style': NO_DEFAULT_VALUE,
  'mask-class': NO_DEFAULT_VALUE,
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const PickerViewColumn = {
  name: NO_DEFAULT_VALUE
}

const Radio = {
  value: NO_DEFAULT_VALUE,
  checked: DEFAULT_FALSE,
  disabled: NO_DEFAULT_VALUE,
  color: singleQuote('#09BB07'),
  name: NO_DEFAULT_VALUE
}

const RadioGroup = {
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Slider = {
  min: '0',
  max: '100',
  step: '1',
  disabled: NO_DEFAULT_VALUE,
  value: '0',
  activeColor: singleQuote('#1aad19'),
  backgroundColor: singleQuote('#e9e9e9'),
  'block-size': '28',
  'block-color': singleQuote('#ffffff'),
  'show-value': DEFAULT_FALSE,
  bindChange: NO_DEFAULT_VALUE,
  bindChanging: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Switch = {
  checked: DEFAULT_FALSE,
  disabled: NO_DEFAULT_VALUE,
  type: singleQuote('switch'),
  color: singleQuote('#04BE02'),
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const Textarea = {
  value: NO_DEFAULT_VALUE,
  placeholder: NO_DEFAULT_VALUE,
  'placeholder-style': NO_DEFAULT_VALUE,
  'placeholder-class': singleQuote('textarea-placeholder'),
  disabled: NO_DEFAULT_VALUE,
  maxlength: '140',
  'auto-focus': DEFAULT_FALSE,
  focus: DEFAULT_FALSE,
  'auto-height': DEFAULT_FALSE,
  fixed: DEFAULT_FALSE,
  'cursor-spacing': '0',
  cursor: '-1',
  'selection-start': '-1',
  'selection-end': '-1',
  bindFocus: NO_DEFAULT_VALUE,
  bindBlur: NO_DEFAULT_VALUE,
  bindLineChange: NO_DEFAULT_VALUE,
  bindInput: NO_DEFAULT_VALUE,
  bindConfirm: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}

const CoverImage = {
  src: NO_DEFAULT_VALUE,
  bindLoad: 'eh',
  bindError: 'eh'
}

const CoverView = {
  'scroll-top': DEFAULT_FALSE,
  ...touchEvents
}

const MovableArea = {
  'scale-area': DEFAULT_FALSE
}

const MovableView = {
  direction: 'none',
  inertia: DEFAULT_FALSE,
  'out-of-bounds': DEFAULT_FALSE,
  x: NO_DEFAULT_VALUE,
  y: NO_DEFAULT_VALUE,
  damping: '20',
  friction: '2',
  disabled: NO_DEFAULT_VALUE,
  scale: DEFAULT_FALSE,
  'scale-min': '0.5',
  'scale-max': '10',
  'scale-value': '1',
  bindChange: NO_DEFAULT_VALUE,
  bindScale: NO_DEFAULT_VALUE,
  bindHTouchMove: NO_DEFAULT_VALUE,
  bindVTouchMove: NO_DEFAULT_VALUE,
  width: singleQuote('10px'),
  height: singleQuote('10px'),
  ...touchEvents,
  ...animation
}

const ScrollView = {
  'scroll-x': DEFAULT_FALSE,
  'scroll-y': DEFAULT_FALSE,
  'upper-threshold': '50',
  'lower-threshold': '50',
  'scroll-top': NO_DEFAULT_VALUE,
  'scroll-left': NO_DEFAULT_VALUE,
  'scroll-into-view': NO_DEFAULT_VALUE,
  'scroll-with-animation': DEFAULT_FALSE,
  'enable-back-to-top': DEFAULT_FALSE,
  bindScrollToUpper: NO_DEFAULT_VALUE,
  bindScrollToLower: NO_DEFAULT_VALUE,
  bindScroll: NO_DEFAULT_VALUE,
  ...touchEvents,
  ...animation
}

const Swiper = {
  'indicator-dots': DEFAULT_FALSE,
  'indicator-color': singleQuote('rgba(0, 0, 0, .3)'),
  'indicator-active-color': singleQuote('#000000'),
  autoplay: DEFAULT_FALSE,
  current: '0',
  interval: '5000',
  duration: '500',
  circular: DEFAULT_FALSE,
  vertical: DEFAULT_FALSE,
  'previous-margin': singleQuote('0px'),
  'next-margin': singleQuote('0px'),
  'display-multiple-items': '1',
  bindChange: NO_DEFAULT_VALUE,
  bindTransition: NO_DEFAULT_VALUE,
  bindAnimationFinish: NO_DEFAULT_VALUE,
  ...touchEvents
}

const SwiperItem = {
  'item-id': NO_DEFAULT_VALUE
}

const Navigator = {
  url: NO_DEFAULT_VALUE,
  'open-type': singleQuote('navigate'),
  delta: '1',
  'hover-class': singleQuote('navigator-hover'),
  'hover-stop-propagation': DEFAULT_FALSE,
  'hover-start-time': '50',
  'hover-stay-time': '600',
  bindSuccess: NO_DEFAULT_VALUE,
  bindFail: NO_DEFAULT_VALUE,
  bindComplete: NO_DEFAULT_VALUE
}

const Audio = {
  id: NO_DEFAULT_VALUE,
  src: NO_DEFAULT_VALUE,
  loop: DEFAULT_FALSE,
  controls: DEFAULT_FALSE,
  poster: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE,
  author: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE,
  bindPlay: NO_DEFAULT_VALUE,
  bindPause: NO_DEFAULT_VALUE,
  bindTimeUpdate: NO_DEFAULT_VALUE,
  bindEnded: NO_DEFAULT_VALUE
}

const Camera = {
  'device-position': singleQuote('back'),
  flash: singleQuote('auto'),
  bindStop: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE
}

const Image = {
  src: NO_DEFAULT_VALUE,
  mode: singleQuote('scaleToFill'),
  'lazy-load': DEFAULT_FALSE,
  bindError: NO_DEFAULT_VALUE,
  bindLoad: NO_DEFAULT_VALUE,
  ...touchEvents
}

const LivePlayer = {
  src: NO_DEFAULT_VALUE,
  autoplay: DEFAULT_FALSE,
  muted: DEFAULT_FALSE,
  orientation: singleQuote('vertical'),
  'object-fit': singleQuote('contain'),
  'background-mute': DEFAULT_FALSE,
  'min-cache': '1',
  'max-cache': '3',
  bindStateChange: NO_DEFAULT_VALUE,
  bindFullScreenChange: NO_DEFAULT_VALUE,
  bindNetStatus: NO_DEFAULT_VALUE,
  ...animation
}

const Video = {
  src: NO_DEFAULT_VALUE,
  duration: NO_DEFAULT_VALUE,
  controls: DEFAULT_TRUE,
  'danmu-list': NO_DEFAULT_VALUE,
  'danmu-btn': NO_DEFAULT_VALUE,
  'enable-danmu': NO_DEFAULT_VALUE,
  autoplay: DEFAULT_FALSE,
  loop: DEFAULT_FALSE,
  muted: DEFAULT_FALSE,
  'initial-time': '0',
  'page-gesture': DEFAULT_FALSE,
  direction: NO_DEFAULT_VALUE,
  'show-progress': DEFAULT_TRUE,
  'show-fullscreen-btn': DEFAULT_TRUE,
  'show-play-btn': DEFAULT_TRUE,
  'show-center-play-btn': DEFAULT_TRUE,
  'enable-progress-gesture': DEFAULT_TRUE,
  'object-fit': singleQuote('contain'),
  poster: NO_DEFAULT_VALUE,
  'show-mute-btn': DEFAULT_FALSE,
  bindPlay: NO_DEFAULT_VALUE,
  bindPause: NO_DEFAULT_VALUE,
  bindEnded: NO_DEFAULT_VALUE,
  bindTimeUpdate: NO_DEFAULT_VALUE,
  bindFullScreenChange: NO_DEFAULT_VALUE,
  bindWaiting: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE,
  ...animation
}

const Canvas = {
  'canvas-id': NO_DEFAULT_VALUE,
  'disable-scroll': DEFAULT_FALSE,
  bindError: NO_DEFAULT_VALUE,
  ...touchEvents
}

const Ad = {
  'unit-id': NO_DEFAULT_VALUE,
  'ad-intervals': NO_DEFAULT_VALUE,
  bindLoad: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE,
  bindClose: NO_DEFAULT_VALUE
}

const WebView = {
  src: NO_DEFAULT_VALUE,
  bindMessage: NO_DEFAULT_VALUE,
  bindLoad: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE
}

const Block = {}

// For Vue，因为 slot 标签被 vue 占用了
const SlotView = {
  name: NO_DEFAULT_VALUE
}

// For React
// Slot 和 SlotView 最终都会编译成 <view slot={{ i.name }} />
// 因为 <slot name="{{ i.name }}" /> 适用性没有前者高（无法添加类和样式）
// 不给 View 直接加 slot 属性的原因是性能损耗
const Slot = {
  name: NO_DEFAULT_VALUE
}

const NativeSlot = {
  name: NO_DEFAULT_VALUE
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
  SlotView,
  NativeSlot,
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
