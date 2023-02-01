import { Fragment } from 'react'

import reactifyWc from './reactify-wc'

// 视图容器
export const CoverImage = reactifyWc('taro-cover-image-core')
export const CoverView = reactifyWc('taro-cover-view-core')
export const MatchMedia = reactifyWc('taro-match-media-core')
export const MovableArea = reactifyWc('taro-movable-area-core')
export const MovableView = reactifyWc('taro-movable-view-core')
export const PageContainer = reactifyWc('taro-page-container-core')
export const RootPortal = reactifyWc('taro-root-portal-core')
export const ScrollView = reactifyWc('taro-scroll-view-core')
export const ShareElement = reactifyWc('taro-share-element-core')
export const Swiper = reactifyWc('taro-swiper-core')
export const SwiperItem = reactifyWc('taro-swiper-item-core')
export const View = reactifyWc('taro-view-core')

// 基础内容
export const Icon = reactifyWc('taro-icon-core')
export const Progress = reactifyWc('taro-progress-core')
export const RichText = reactifyWc('taro-rich-text-core')
export const Text = reactifyWc('taro-text-core')

// 表单组件
export const Button = reactifyWc('taro-button-core')
export const Checkbox = reactifyWc('taro-checkbox-core')
export const CheckboxGroup = reactifyWc('taro-checkbox-group-core')
export const Editor = reactifyWc('taro-editor-core')
export const Form = reactifyWc('taro-form-core')
export { default as Input } from './input'
export const KeyboardAccessory = reactifyWc('taro-keyboard-accessory-core')
export const Label = reactifyWc('taro-label-core')
export const Picker = reactifyWc('taro-picker-core')
export const PickerView = reactifyWc('taro-picker-view-core')
export const PickerViewColumn = reactifyWc('taro-picker-view-column-core')
export const Radio = reactifyWc('taro-radio-core')
export const RadioGroup = reactifyWc('taro-radio-group-core')
export const Slider = reactifyWc('taro-slider-core')
export const Switch = reactifyWc('taro-switch-core')
export const Textarea = reactifyWc('taro-textarea-core')

// 导航
export const FunctionalPageNavigator = reactifyWc('taro-functional-page-navigator-core')
export const Navigator = reactifyWc('taro-navigator-core')
export const NavigationBar = reactifyWc('taro-navigation-bar-core')

// 媒体组件
export const Audio = reactifyWc('taro-audio-core')
export const Camera = reactifyWc('taro-camera-core')
export const Image = reactifyWc('taro-image-core')
export const LivePlayer = reactifyWc('taro-live-player-core')
export const LivePusher = reactifyWc('taro-live-pusher-core')
export const Video = reactifyWc('taro-video-core')
export const VoipRoom = reactifyWc('taro-voip-room-core')

// 地图
export const Map = reactifyWc('taro-map-core')

// 画布
export const Canvas = reactifyWc('taro-canvas-core')

// 开放能力
export const Ad = reactifyWc('taro-ad-core')
export const AdCustom = reactifyWc('taro-ad-custom-core')
export const OfficialAccount = reactifyWc('taro-official-account-core')
export const OpenData = reactifyWc('taro-open-data-core')
export const WebView = reactifyWc('taro-web-view-core')

// 页面属性配置节点
export const PageMeta = reactifyWc('taro-page-meta-core')

// 其他
export const Block = Fragment
export const CustomWrapper = reactifyWc('taro-custom-wrapper-core')
