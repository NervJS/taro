import { Shortcuts } from './shortcuts'
import { toDashed, hasOwn, toCamelCase } from '@tarojs/shared'

const styles = {
  style: `i.${Shortcuts.Style}`,
  class: `i.${Shortcuts.Class}`
}

const events = {
  bindtap: 'eh'
}

const common = {
  ...styles,
  ...events
}

const View = {
  'hover-class': 'none',
  'hover-stop-propagation': 'false',
  'hover-start-time': '50',
  'hover-stay-time': '400'
}

const Icon = {
  type: '',
  size: '23',
  color: ''
}

const Progress = {
  percent: '',
  'show-info': 'fasle',
  'border-radius': '0',
  'font-size': '16',
  'stroke-width': '6',
  color: singleQuote('#09BB07'),
  activeColor: singleQuote('#09BB07'),
  backgroundColor: singleQuote('#EBEBEB'),
  active: 'false',
  'active-mode': 'backwards',
  duration: '30',
  bindactiveend: ''
}

const RichText = {
  nodes: '[]',
  space: ''
}

const Text = {
  selectable: 'false',
  space: '',
  decode: 'false'
}

const Button = {
  size: 'default',
  type: 'default',
  plain: 'false',
  disabled: 'false',
  loading: 'false',
  'form-type': '',
  'open-type': '',
  'hover-class': 'button-hover',
  'hover-stop-propagation': 'false',
  'hover-start-time': '20',
  'hover-stay-time': '70',
  lang: 'en',
  'session-from': '',
  'send-message-title': '',
  'send-message-path': '',
  'send-message-img': '',
  'app-parameter': '',
  'show-message-card': 'false',
  bindgetuserinfo: '',
  bindcontact: '',
  bindgetphonenumber: '',
  binderror: '',
  bindopensetting: '',
  bindlaunchapp: ''
}

const Checkbox = {
  value: '',
  disabled: 'false',
  checked: 'false',
  color: singleQuote('#09BB07')
}

const CheckboxGroup = {
  bindchange: ''
}

const Editor = {
  'read-only': 'false',
  placeholder: '',
  'show-img-size': 'false',
  'show-img-toolbar': 'false',
  'show-img-resize': 'false',
  bindready: '',
  bindfocus: '',
  bindblur: '',
  bindinput: '',
  bindstatuschange: ''
}

const Form = {
  'report-submit': 'false',
  'report-submit-timeout': '0',
  bindsubmit: '',
  bindreset: ''
}

const Input = {
  value: '',
  type: 'text',
  password: 'false',
  placeholder: '',
  'placeholder-style': '',
  'placeholder-class': singleQuote('input-placeholder'),
  disabled: 'false',
  maxlength: '140',
  'cursor-spacing': '0',
  'auto-focus': 'false',
  focus: 'false',
  'confirm-type': singleQuote('done'),
  'confirm-hold': 'false',
  cursor: '',
  'selection-start': '-1',
  'selection-end': '-1',
  'adjust-position': 'true',
  'hold-keyboard': 'false',
  bindinput: '',
  bindfocus: '',
  bindblur: '',
  bindconfirm: '',
  bindkeyboardheightchange: ''
}

const Label = {
  for: ''
}

const Picker = {
  mode: singleQuote('selector'),
  disabled: 'false',
  bindcancel: ''
}

const PickerView = {
  value: '',
  'indicator-style': '',
  'indicator-class': '',
  'mask-style': '',
  'mask-class': '',
  bindchange: '',
  bindpickstart: '',
  bindpickend: ''
}

const PickerViewColumn = {
  //
}

const Radio = {
  value: '',
  checked: 'false',
  disabled: 'false',
  color: singleQuote('#09BB07')
}

const RadioGroup = {
  bindchange: ''
}

const Slider = {
  min: '0',
  max: '100',
  step: '1',
  disabled: 'false',
  value: '0',
  color: singleQuote('#e9e9e9'),
  'selected-color': singleQuote('#1aad19'),
  activeColor: singleQuote('#1aad19'),
  backgroundColor: singleQuote('#e9e9e9'),
  'block-size': '28',
  'block-color': singleQuote('#ffffff'),
  'show-value': 'false',
  bindchange: '',
  bindchanging: ''
}

const Switch = {
  checked: 'false',
  disabled: 'false',
  type: singleQuote('switch'),
  color: singleQuote('#04BE02'),
  bindchange: ''
}

const CoverImage = {
  src: '',
  bindload: 'eh',
  binderror: 'eh'
}

const Textarea = {
  value: '',
  placeholder: '',
  'placeholder-style': '',
  'placeholder-class': singleQuote('textarea-placeholder'),
  disabled: 'false',
  maxlength: '140',
  'auto-focus': 'false',
  focus: 'false',
  'auto-height': 'false',
  fixed: 'false',
  'cursor-spacing': '0',
  cursor: '-1',
  'show-confirm-bar': 'true',
  'selection-start': '-1',
  'selection-end': '-1',
  'adjust-position': 'true',
  'hold-keyboard': 'false',
  bindfocus: '',
  bindblur: '',
  bindlinechange: '',
  bindinput: '',
  bindconfirm: '',
  bindkeyboardheightchange: ''
}

const CoverView = {
  'scroll-top': 'false'
}

const MoveableArea = {
  'scale-area': 'false'
}

const MoveableView = {
  direction: 'none',
  inertia: 'false',
  'out-of-bounds': 'false',
  x: '',
  y: '',
  damping: '20',
  friction: '2',
  disabled: 'fasle',
  scale: 'false',
  'scale-min': '0.5',
  'scale-max': '10',
  'scale-value': '1',
  animation: 'true',
  bindchange: '',
  bindscale: '',
  htouchmove: '',
  vtouchmove: '',
  width: '10px',
  height: '10px'
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
  'enable-flex': 'false',
  'scroll-anchoring': ' false',
  bindscrolltoupper: '',
  bindscrolltolower: '',
  bindscroll: ''
}

function singleQuote (s: string) {
  return `'${s}'`
}

const Swiper = {
  'indicator-dots': 'false',
  'indicator-color': '\'rgba(0, 0, 0, .3)\'',
  'indicator-active-color': '\'#000000\'',
  autoplay: 'fasle',
  current: '0',
  interval: '5000',
  duration: '500',
  circular: 'false',
  vertical: 'fasle',
  'previous-margin': '\'0px\'',
  'next-margin': '\'0px\'',
  'display-multiple-items': '1',
  'skip-hidden-item-layout': 'false',
  'easing-function': singleQuote('default'),
  bindchange: '',
  bindtransition: '',
  bindanimationfinish: ''
}

const SwiperItem = {
  'item-id': ''
}

const FunctionalPageNavigator = {
  version: singleQuote('release'),
  name: '',
  args: '',
  bindsuccess: '',
  bindfail: '',
  bindcancel: ''
}

const Navigator = {
  target: singleQuote('self'),
  url: '',
  'open-type': singleQuote('navigate'),
  delta: '1',
  'app-id': '',
  path: '',
  'extra-data': '',
  version: singleQuote('version'),
  'hover-class': singleQuote('navigator-hover'),
  'hover-stop-propagation': 'false',
  'hover-start-time': '50',
  'hover-stay-time': '600',
  bindsuccess: '',
  bindfail: '',
  bindcomplete: ''
}

const Audio = {
  id: '',
  src: '',
  loop: 'false',
  controls: 'false',
  poster: '',
  name: '',
  author: '',
  binderror: '',
  bindplay: '',
  bindpause: '',
  bindtimeupdate: '',
  bindended: ''
}

const specialEvents = new Set([
  'htouchmove',
  'vtouchmove'
])

const Camera = {
  mode: singleQuote('normal'),
  'device-position': singleQuote('back'),
  flash: singleQuote('auto'),
  'frame-size': singleQuote('medium'),
  bindstop: '',
  binderror: '',
  bindinitdone: '',
  bindscancode: ''
}

const Image = {
  src: '',
  mode: singleQuote('scaleToFill'),
  webp: 'false',
  'lazy-load': 'false',
  'show-menu-by-longpress': 'false',
  binderror: '',
  bindload: ''
}

const LivePlayer = {
  src: '',
  mode: singleQuote('live'),
  autoplay: 'false',
  muted: 'false',
  orientation: singleQuote('vertical'),
  'object-fit': singleQuote('contain'),
  'background-mute': 'false',
  'min-cache': '1',
  'max-cache': '3',
  'sound-mode': singleQuote('speaker'),
  'auto-pause-if-navigate': 'true',
  'auto-pause-if-open-native': 'true',
  bindstatechange: '',
  bindfullscreenchange: '',
  bindnetstatus: ''
}

interface Components {
  [key: string]: Record<string, string>;
}

function createComponents (components: Components) {
  const result: Components = Object.create(null)

  for (const key in components) {
    if (hasOwn(components, key)) {
      const component = components[key]
      const compName = toDashed(key)
      const newComp: Record<string, string> = Object.create(null)
      for (const prop in component) {
        if (hasOwn(component, prop)) {
          let propValue = component[prop]
          if (prop.startsWith('bind') || specialEvents.has(prop)) {
            propValue = 'eh'
          } else if (propValue === '') {
            propValue = `i.${toCamelCase(prop)}`
          } else {
            propValue = `i.${toCamelCase(prop)} || ${propValue}`
          }

          newComp[prop] = propValue
        }
      }
      Object.assign(newComp, common)
      result[compName] = newComp
    }
  }

  return result
}

export const standComponents = createComponents({
  View,
  Icon,
  Progress,
  RichText,
  Text,
  Button,
  Checkbox,
  CheckboxGroup,
  Editor,
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
  MoveableArea,
  MoveableView,
  ScrollView,
  Swiper,
  SwiperItem,
  FunctionalPageNavigator,
  Navigator,
  Audio,
  Camera,
  Image,
  LivePlayer
})
