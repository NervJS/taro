import { createComponent } from './utils';

// 视图容器
export const CoverImage = createComponent('taro-cover-image-core');
export const CoverView = createComponent('taro-cover-view-core');
export const MatchMedia = createComponent('taro-match-media-core');
export const MovableArea = createComponent('taro-movable-area-core');
export const MovableView = createComponent('taro-movable-view-core');
export const PageContainer = createComponent('taro-page-container-core');
export const RootPortal = createComponent('taro-root-portal-core');
export const ScrollView = createComponent('taro-scroll-view-core');
export const ShareElement = createComponent('taro-share-element-core');
export const Swiper = createComponent('taro-swiper-core');
export const SwiperItem = createComponent('taro-swiper-item-core');
export const View = createComponent('taro-view-core');

// 基础内容
export const Icon = createComponent('taro-icon-core');
export const Progress = createComponent('taro-progress-core');
export const RichText = createComponent('taro-rich-text-core');
export const Text = createComponent('taro-text-core');

// 表单组件
export const Button = createComponent('taro-button-core');
export const Checkbox = createComponent('taro-checkbox-core');
export const CheckboxGroup = createComponent('taro-checkbox-group-core');
export const Editor = createComponent('taro-editor-core');
export const Form = createComponent('taro-form-core');
export { default as Input } from './input';
export const KeyboardAccessory = createComponent(
  'taro-keyboard-accessory-core',
);
export const Label = createComponent('taro-label-core');
export const Picker = createComponent('taro-picker-core');
export const PickerView = createComponent('taro-picker-view-core');
export const PickerViewColumn = createComponent('taro-picker-view-column-core');
export const Radio = createComponent('taro-radio-core');
export const RadioGroup = createComponent('taro-radio-group-core');
export const Slider = createComponent('taro-slider-core');
export const Switch = createComponent('taro-switch-core');
export const Textarea = createComponent('taro-textarea-core');

// 导航
export const FunctionalPageNavigator = createComponent(
  'taro-functional-page-navigator-core',
);
export const Navigator = createComponent('taro-navigator-core');

// 媒体组件
export const Audio = createComponent('taro-audio-core');
export const Camera = createComponent('taro-camera-core');
export const Image = createComponent('taro-image-core');
export const LivePlayer = createComponent('taro-live-player-core');
export const Video = createComponent('taro-video-core');
export const VoipRoom = createComponent('taro-voip-room-core');

// 地图
export const Map = createComponent('taro-map-core');

// 画布
export const Canvas = createComponent('taro-canvas-core');

// 开放能力
export const WebView = createComponent('taro-web-view-core');
export const Ad = createComponent('taro-ad-core');
export const AdCustom = createComponent('taro-ad-custom-core');
export const OfficialAccount = createComponent('taro-official-account-core');
export const OpenData = createComponent('taro-open-data-core');

// 导航栏
export const NavigationBar = createComponent('taro-navigation-bar-core');

// 页面属性配置节点
export const PageMeta = createComponent('taro-page-meta-core');

// 其他
export const Block = createComponent('taro-block-core');
export const CustomWrapper = createComponent('taro-custom-wrapper-core');
