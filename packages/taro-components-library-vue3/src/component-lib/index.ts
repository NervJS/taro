import createComponent from './createComponent'
import createFormsComponent from './createFormsComponent'

// 视图容器
export const CoverImage = /* @__PURE__ */ createComponent('taro-cover-image')
export const CoverView = /* @__PURE__ */ createComponent('taro-cover-view')
export const MatchMedia = /* @__PURE__ */ createComponent('taro-match-media')
export const MovableArea = /* @__PURE__ */ createComponent('taro-movable-area')
export const MovableView = /* @__PURE__ */ createComponent('taro-movable-view')
export const PageContainer = /* @__PURE__ */ createComponent('taro-page-container')
export const RootPortal = /* @__PURE__ */ createComponent('taro-root-portal')
export { default as ScrollView } from './scroll-view'
export const ShareElement = /* @__PURE__ */ createComponent('taro-share-element')
export const Swiper = /* @__PURE__ */ createComponent('taro-swiper')
export const SwiperItem = /* @__PURE__ */ createComponent('taro-swiper-item', ['swiper-slide'])
export const View = /* @__PURE__ */ createComponent('taro-view')

// 基础内容
export { default as Icon } from './icon'
export const Progress = /* @__PURE__ */ createComponent('taro-progress', ['weui-progress'])
export const RichText = /* @__PURE__ */ createComponent('taro-rich-text')
export { default as Text } from './text'

// 表单组件
export const Button = /* @__PURE__ */ createComponent('taro-button')
export const Checkbox = /* @__PURE__ */ createComponent('taro-checkbox', ['weui-cells_checkbox'])
export const CheckboxGroup = /* @__PURE__ */ createComponent('taro-checkbox-group')
export const Editor = /* @__PURE__ */ createComponent('taro-editor')
export const Form = /* @__PURE__ */ createComponent('taro-form')
export const Input = /* @__PURE__ */ createFormsComponent('taro-input', 'input')
export const KeyboardAccessory = /* @__PURE__ */ createComponent('taro-keyboard-accessory')
export const Label = /* @__PURE__ */ createComponent('taro-label')
export const Picker = /* @__PURE__ */ createFormsComponent('taro-picker', 'change')
export const PickerView = /* @__PURE__ */ createComponent('taro-picker-view')
export const PickerViewColumn = /* @__PURE__ */ createComponent('taro-picker-view-column')
export const Radio = /* @__PURE__ */ createComponent('taro-radio', ['weui-cells_checkbox'])
export const RadioGroup = /* @__PURE__ */ createComponent('taro-radio-group', ['weui-cells_radiogroup'])
export const Slider = /* @__PURE__ */ createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box'])
export const Switch = /* @__PURE__ */ createFormsComponent('taro-switch', 'change', 'checked')
export const Textarea = /* @__PURE__ */ createFormsComponent('taro-textarea', 'input')

// 导航
export const FunctionalPageNavigator = /* @__PURE__ */ createComponent('taro-functional-page-navigator')
export const Navigator = /* @__PURE__ */ createComponent('taro-navigator')

// 媒体组件
export const Audio = /* @__PURE__ */ createComponent('taro-audio')
export const Camera = /* @__PURE__ */ createComponent('taro-camera')
export { default as Image } from './image'
export const LivePlayer = /* @__PURE__ */ createComponent('taro-live-player')
export const Video = /* @__PURE__ */ createComponent('taro-video', ['taro-video-container'])
export const VoipRoom = /* @__PURE__ */ createComponent('taro-voip-room')

// 地图
export const Map = /* @__PURE__ */ createComponent('taro-map')

// 画布
export const Canvas = /* @__PURE__ */ createComponent('taro-canvas')

// 开放能力
export const WebView = /* @__PURE__ */ createComponent('taro-web-view')
export const Ad = /* @__PURE__ */ createComponent('taro-ad')
export const AdCustom = /* @__PURE__ */ createComponent('taro-ad-custom')
export const OfficialAccount = /* @__PURE__ */ createComponent('taro-official-account')
export const OpenData = /* @__PURE__ */ createComponent('taro-open-data')

// 导航栏
export const NavigationBar = /* @__PURE__ */ createComponent('taro-navigation-bar')

// 页面属性配置节点
export const PageMeta = /* @__PURE__ */ createComponent('taro-page-meta')

// 其他
export const Block = /* @__PURE__ */ createComponent('taro-block')
export const CustomWrapper = /* @__PURE__ */ createComponent('taro-custom-wrapper')
export const Slot = /* @__PURE__ */ createComponent('taro-slot')
