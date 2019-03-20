import { Adapters } from './adapter'

export const THIRD_PARTY_COMPONENTS = new Set<string>()

// tslint:disable-next-line:variable-name
export const DEFAULT_Component_SET = new Set<string>([
  'View',
  'ScrollView',
  'Swiper',
  'MovableView',
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
  'OfficialAccount'
])

export const INTERNAL_SAFE_GET = 'internal_safe_get'

export const TARO_PACKAGE_NAME = '@tarojs/taro'

export const COMPONENTS_PACKAGE_NAME = '@tarojs/components'

export const REDUX_PACKAGE_NAME = '@tarojs/redux'

export const MOBX_PACKAGE_NAME = '@tarojs/mobx'

export const MAP_CALL_ITERATOR = '__item'

export const INTERNAL_INLINE_STYLE = 'internal_inline_style'

export const INTERNAL_GET_ORIGNAL = 'internal_get_original'

export const GEL_ELEMENT_BY_ID = 'getElementById'

export const LOOP_STATE = '$loopState'

export let LOOP_ORIGINAL = '$original'

export const setLoopOriginal = (s: string) => LOOP_ORIGINAL = s

export const LOOP_CALLEE = '$anonymousCallee_'

export const SPECIAL_COMPONENT_PROPS = new Map<string, Set<string>>()

SPECIAL_COMPONENT_PROPS.set(
  'Progress',
  new Set([
    'activeColor',
    'backgroundColor'
  ])
)

export const IMAGE_COMPONENTS = new Set<string>([
  'Image',
  'CoverImage'
])

export const swanSpecialAttrs = {
  'ScrollView': ['scrollTop', 'scrollLeft', 'scrollIntoView'],
  'Input': ['value'],
  'Textarea': ['value'],
  'MovableView': ['x', 'y'],
  'Slider': ['value']
}

export const ALIPAY_BUBBLE_EVENTS = new Set<string>([
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onTouchCancel',
  'onClick',
  'onLongTap'
])

export const TRANSFORM_COMPONENT_PROPS = new Map<Adapters, { [key: string]: { [key: string]: string } }>()

TRANSFORM_COMPONENT_PROPS.set(Adapters.alipay, {
  'Canvas': {
    'canvasId': 'id'
  }
})

export const lessThanSignPlacehold = '__LESS_THAN_SIGN_PLACEHOLDER__'
