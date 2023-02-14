import createComponent from './createComponent'
import createFormsComponent from './createFormsComponent'

// 视图容器
export const CoverImage = createComponent('taro-cover-image')
export const CoverView = createComponent('taro-cover-view')
export const MatchMedia = createComponent('taro-match-media')
export const MovableArea = createComponent('taro-movable-area')
export const MovableView = createComponent('taro-movable-view')
export const PageContainer = createComponent('taro-page-container')
export const RootPortal = createComponent('taro-root-portal')
export { default as ScrollView } from './scroll-view'
export const ShareElement = createComponent('taro-share-element')
export const Swiper = createComponent('taro-swiper')
export const SwiperItem = createComponent('taro-swiper-item', ['swiper-slide'])
export const View = createComponent('taro-view')

// 基础内容
export { default as Icon } from './icon'
export const Progress = createComponent('taro-progress', ['weui-progress'])
export const RichText = createComponent('taro-rich-text')
export { default as Text } from './text'

// 表单组件
export const Button = createComponent('taro-button')
export const Checkbox = createComponent('taro-checkbox', ['weui-cells_checkbox'])
export const CheckboxGroup = createComponent('taro-checkbox-group')
export const Editor = createComponent('taro-editor')
export const Form = createComponent('taro-form')
export const Input = createFormsComponent('taro-input', 'input')
export const KeyboardAccessory = createComponent('taro-keyboard-accessory')
export const Label = createComponent('taro-label')
export const Picker = createFormsComponent('taro-picker', 'change')
export const PickerView = createComponent('taro-picker-view')
export const PickerViewColumn = createComponent('taro-picker-view-column')
export const Radio = createComponent('taro-radio', ['weui-cells_checkbox'])
export const RadioGroup = createComponent('taro-radio-group', ['weui-cells_radiogroup'])
export const Slider = createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box'])
export const Switch = createFormsComponent('taro-switch', 'change', 'checked')
export const Textarea = createFormsComponent('taro-textarea', 'input')

// 导航
export const FunctionalPageNavigator = createComponent('taro-functional-page-navigator')
export const Navigator = createComponent('taro-navigator')

// 媒体组件
export const Audio = createComponent('taro-audio')
export const Camera = createComponent('taro-camera')
export { default as Image } from './image'
export const LivePlayer = createComponent('taro-live-player')
export const Video = createComponent('taro-video', ['taro-video-container'])
export const VoipRoom = createComponent('taro-voip-room')

// 地图
export const Map = createComponent('taro-map')

// 画布
export const Canvas = createComponent('taro-canvas')

// 开放能力
export const WebView = createComponent('taro-web-view')
export const Ad = createComponent('taro-ad')
export const AdCustom = createComponent('taro-ad-custom')
export const OfficialAccount = createComponent('taro-official-account')
export const OpenData = createComponent('taro-open-data')

// 导航栏
export const NavigationBar = createComponent('taro-navigation-bar')

// 页面属性配置节点
export const PageMeta = createComponent('taro-page-meta')

// 其他
export const Block = createComponent('taro-block')
export const CustomWrapper = createComponent('taro-custom-wrapper')
export const Slot = createComponent('taro-slot')
