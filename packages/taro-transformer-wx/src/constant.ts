import { Adapters } from './adapter'

export const THIRD_PARTY_COMPONENTS = new Set<string>()

// tslint:disable-next-line:variable-name
export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'ScrollView',
  'Swiper',
  'CoverView',
  'CoverImage',
  'Icon',
  'Text',
  'RichText',
  'Progress',
  'Button',
  'Checkbox',
  'Form',
  'Input',
  'Label',
  'Picker',
  'PickerView',
  'PickerViewColumn',
  'Radio',
  'RadioGroup',
  'CheckboxGroup',
  'Slider',
  'Switch',
  'Textarea',
  'Navigator',
  'Audio',
  'Image',
  'Video',
  'Camera',
  'LivePlayer',
  'LivePusher',
  'Map',
  'Canvas',
  'OpenData',
  'WebView',
  'SwiperItem',
  'MovableArea',
  'MovableView',
  'FunctionalPageNavigator',
  'Ad',
  'Block',
  'Import',
  'OfficialAccount',
  'Template',
  'Editor',
])

// tslint:disable-next-line:variable-name
export const DEFAULT_Component_SET_COPY = new Set<string>([])
DEFAULT_Component_SET.forEach((c) => DEFAULT_Component_SET_COPY.add(c))

export const INTERNAL_SAFE_GET = 'internal_safe_get'

export const TARO_PACKAGE_NAME = '@tarojs/taro'

export const COMPONENTS_PACKAGE_NAME = '@tarojs/components'

export const REDUX_PACKAGE_NAME = '@tarojs/redux'

export const MOBX_PACKAGE_NAME = '@tarojs/mobx'

export const MAP_CALL_ITERATOR = '__item'

export const INTERNAL_INLINE_STYLE = 'internal_inline_style'

export const INTERNAL_GET_ORIGNAL = 'internal_get_original'

export const HANDLE_LOOP_REF = 'handleLoopRef'

export const PROPS_MANAGER = 'propsManager'

export const GEN_COMP_ID = 'genCompid'

export const GEN_LOOP_COMPID = 'genLoopCompid'

export const CLASS_COMPONENT_UID = '_$uid'

export let LOOP_STATE = '$loopState'

export const setLoopState = (s: string) => (LOOP_STATE = s)

export let PREV_COMPID = '$prevCompid'

export let COMPID = '$compid'

export const setCompId = (s: string) => (COMPID = s)

export let LOOP_ORIGINAL = '$original'

export const setLoopOriginal = (s: string) => (LOOP_ORIGINAL = s)

export let LOOP_CALLEE = '$anonymousCallee_'

export let setLoopCallee = (s: string) => (LOOP_CALLEE = s)

export const CONTEXT_PROVIDER = 'PrivateContextProvider'

export const SPECIAL_COMPONENT_PROPS = new Map<string, Set<string>>()

export let IS_TARO_READY = '$taroCompReady'

export const setIsTaroReady = (s: string) => (IS_TARO_READY = s)

SPECIAL_COMPONENT_PROPS.set('Progress', new Set(['activeColor', 'backgroundColor']))

export const IMAGE_COMPONENTS = new Set<string>(['Image', 'CoverImage'])

export const swanSpecialAttrs = {
  ScrollView: ['scrollTop', 'scrollLeft', 'scrollIntoView'],
  Input: ['value'],
  Textarea: ['value'],
  MovableView: ['x', 'y'],
  Slider: ['value'],
}

export const ALIPAY_BUBBLE_EVENTS = new Set<string>([
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onTouchCancel',
  'onClick',
  'onLongTap',
])

export const ANONYMOUS_FUNC = 'anonymousFunc'

export const TRANSFORM_COMPONENT_PROPS = new Map<Adapters, { [key: string]: { [key: string]: string } }>()

TRANSFORM_COMPONENT_PROPS.set(Adapters.alipay, {
  Canvas: {
    canvasId: 'id',
  },
})

export const lessThanSignPlacehold = '__LESS_THAN_SIGN_PLACEHOLDER__'

export let FN_PREFIX = '__fn_'

export const setFnPrefix = (s: string) => (FN_PREFIX = s)

export const quickappComponentName = new Set([
  'Swiper',
  'Audio',
  'Image',
  'Progress',
  // 'Text',
  'Input',
  'Label',
  'Picker',
  'Slider',
  'Switch',
  'Textarea',
  'Video',
  'Camera',
  'Canvas',
  'Map',
  'Button',
])
