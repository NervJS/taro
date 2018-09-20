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
  'Block'
])

export const INTERNAL_SAFE_GET = 'internal_safe_get'

export const TARO_PACKAGE_NAME = '@tarojs/taro'

export const COMPONENTS_PACKAGE_NAME = '@tarojs/components'

export const ASYNC_PACKAGE_NAME = '@tarojs/async-await'

export const REDUX_PACKAGE_NAME = '@tarojs/redux'

export const MAP_CALL_ITERATOR = '__item'

export const INTERNAL_INLINE_STYLE = 'internal_inline_style'

export const INTERNAL_GET_ORIGNAL = 'internal_get_original'

export const LOOP_STATE = '$loopState'

export const LOOP_ORIGINAL = '$$original'

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
