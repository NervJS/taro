/**
 * vue tsx @tarojs/components 类型提示文件
 *
 * ## 如何使用?

 * 请在醒目全局的类型文件中写入以下代码，覆盖默认的组件类型提示
 * ```typescript
 * export declare module '@tarojs/components' {
 *   export * from '@tarojs/components/types/index.vue3'
 * }
 * ```
 */
 import * as CSS from 'csstype'
 import { DefineComponent } from 'vue'

 import { StandardProps } from './common'
 /** 视图容器 */
 import { CoverImageProps } from './CoverImage'
 import { CoverViewProps } from './CoverView'
 import { MatchMediaProps } from './MatchMedia'
 import { MovableAreaProps } from './MovableArea'
 import { MovableViewProps } from './MovableView'
 import { PageContainerProps } from './PageContainer'
 import { ScrollViewProps } from './ScrollView'
 import { ShareElementProps } from './ShareElement'
 import { SwiperProps } from './Swiper'
 import { SwiperItemProps } from './SwiperItem'
 import { ViewProps } from './View'
 /** 基础内容 */
 import { IconProps } from './Icon'
 import { ProgressProps } from './Progress'
 import { RichTextProps } from './RichText'
 import { TextProps } from './Text'
 /** 表单组件 */
 import { ButtonProps } from './Button'
 import { CheckboxProps } from './Checkbox'
 import { CheckboxGroupProps } from './CheckboxGroup'
 import { EditorProps } from './Editor'
 import { FormProps } from './Form'
 import { InputProps } from './Input'
 import { KeyboardAccessoryProps } from './KeyboardAccessory'
 import { LabelProps } from './Label'
 import { PickerDateProps, PickerTimeProps, PickerRegionProps, PickerSelectorProps, PickerMultiSelectorProps } from './Picker'
 import { PickerViewProps } from './PickerView'
 import { RadioProps } from './Radio'
 import { RadioGroupProps } from './RadioGroup'
 import { SliderProps } from './Slider'
 import { SwitchProps } from './Switch'
 import { TextareaProps } from './Textarea'
 /** 导航 */
 import { FunctionalPageNavigatorProps } from './FunctionalPageNavigator'
 import { NavigatorProps } from './Navigator'
 import { NavigationBarProps } from './NavigationBar'
 /** 媒体组件 */
 import { AudioProps } from './Audio'
 import { CameraProps } from './Camera'
 import { ImageProps } from './Image'
 import { LivePlayerProps } from './LivePlayer'
 import { LivePusherProps } from './LivePusher'
 import { VideoProps } from './Video'
 import { VoipRoomProps } from './VoipRoom'
 /** 地图 */
 import { MapProps } from './Map'
 /** 画布 */
 import { CanvasProps } from './Canvas'
 /** 开放能力 */
 import { AdProps } from './Ad'
 import { AdCustomProps } from './AdCustom'
 import { OfficialAccountProps } from './OfficialAccount'
 import { OpenDataProps } from './OpenData'
 import { WebViewProps } from './WebView'
 /** 配置节点 */
 import { PageMetaProps } from './PageMeta'

 import { CustomWrapperProps } from './CustomWrapper'
 import { SlotProps } from './Slot'

 /** 联合类型不能用omit（比如picker） */
 type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never

 interface SlimProps {
   class?: any
   style?: CSS.Properties<string | number>
   innerHTML?: string
 }

 /** 转换 react 的类型到 vue */
 type RemoveReactAttribute = 'className' | 'style' | 'key' | 'ref' | 'dangerouslySetInnerHTML'
 type TransformReact2VueType<P extends StandardProps = Record<string, never>> = DistributiveOmit<P, RemoveReactAttribute> & SlimProps
 export type VueComponentType<P = Record<string, never>> = DefineComponent<TransformReact2VueType<P>>

 export * from './common'
 export * from './event'
 export * from './props'

 /** 视图容器 */
 export declare const Block: VueComponentType<StandardProps>
 export declare const CoverImage: VueComponentType<CoverImageProps>
 export declare const CoverView: VueComponentType<CoverViewProps>
 export declare const MatchMedia: VueComponentType<MatchMediaProps>
 export declare const MovableArea: VueComponentType<MovableAreaProps>
 export declare const MovableView: VueComponentType<MovableViewProps>
 export declare const PageContainer: VueComponentType<PageContainerProps>
 export declare const RootPortal: VueComponentType
 export declare const ScrollView: VueComponentType<ScrollViewProps>
 export declare const ShareElement: VueComponentType<ShareElementProps>
 export declare const Swiper: VueComponentType<SwiperProps>
 export declare const SwiperItem: VueComponentType<SwiperItemProps>
 export declare const View: VueComponentType<ViewProps>
 /** 基础内容 */
 export declare const Icon: VueComponentType<IconProps>
 export declare const Progress: VueComponentType<ProgressProps>
 export declare const RichText: VueComponentType<RichTextProps>
 export declare const Text: VueComponentType<TextProps>
 /** 表单组件 */
 export declare const Button: VueComponentType<ButtonProps>
 export declare const Checkbox: VueComponentType<CheckboxProps>
 export declare const CheckboxGroup: VueComponentType<CheckboxGroupProps>
 export declare const Editor: VueComponentType<EditorProps>
 export declare const Form: VueComponentType<FormProps>
 export declare const Input: VueComponentType<InputProps>
 export declare const KeyboardAccessory: VueComponentType<KeyboardAccessoryProps>
 export declare const Label: VueComponentType<LabelProps>
 export declare const Picker: VueComponentType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps>
 export declare const PickerView: VueComponentType<PickerViewProps>
 export declare const PickerViewColumn: VueComponentType
 export declare const Radio: VueComponentType<RadioProps>
 export declare const RadioGroup: VueComponentType<RadioGroupProps>
 export declare const Slider: VueComponentType<SliderProps>
 export declare const Switch: VueComponentType<SwitchProps>
 export declare const Textarea: VueComponentType<TextareaProps>
 /** 导航 */
 export declare const FunctionalPageNavigator: VueComponentType<FunctionalPageNavigatorProps>
 export declare const Navigator: VueComponentType<NavigatorProps>
 export declare const NavigationBar: VueComponentType<NavigationBarProps>
 /** 媒体组件 */
 export declare const Audio: VueComponentType<AudioProps>
 export declare const Camera: VueComponentType<CameraProps>
 export declare const Image: VueComponentType<ImageProps>
 export declare const LivePlayer: VueComponentType<LivePlayerProps>
 export declare const LivePusher: VueComponentType<LivePusherProps>
 export declare const Video: VueComponentType<VideoProps>
 export declare const VoipRoom: VueComponentType<VoipRoomProps>
 /** 地图 */
 export declare const Map: VueComponentType<MapProps>
 /** 画布 */
 export declare const Canvas: VueComponentType<CanvasProps>
 /** 开放能力 */
 export declare const Ad: VueComponentType<AdProps>
 export declare const AdCustom: VueComponentType<AdCustomProps>
 export declare const OfficialAccount: VueComponentType<OfficialAccountProps>
 export declare const OpenData: VueComponentType<OpenDataProps>
 export declare const WebView: VueComponentType<WebViewProps>
 /** 配置节点 */
 export declare const PageMeta: VueComponentType<PageMetaProps>

 export declare const CustomWrapper: VueComponentType<CustomWrapperProps>
 export declare const Slot: VueComponentType<SlotProps>

 declare global {
   namespace JSX {
     interface IntrinsicElements {
       /** 视图容器 */
       block: TransformReact2VueType<StandardProps>
       'taro-block-core': TransformReact2VueType<StandardProps>
       'cover-image': TransformReact2VueType<CoverImageProps>
       'taro-cover-image-core': TransformReact2VueType<CoverImageProps>
       'cover-view': TransformReact2VueType<CoverViewProps>
       'taro-cover-view-core': TransformReact2VueType<CoverViewProps>
       'match-media': TransformReact2VueType<MatchMediaProps>
       'taro-match-media-core': TransformReact2VueType<MatchMediaProps>
       'movable-area': TransformReact2VueType<MovableAreaProps>
       'taro-movable-area-core': TransformReact2VueType<MovableAreaProps>
       'movable-view': TransformReact2VueType<MovableViewProps>
       'taro-movable-view-core': TransformReact2VueType<MovableViewProps>
       'page-container': TransformReact2VueType<PageContainerProps>
       'taro-page-container-core': TransformReact2VueType<PageContainerProps>
       'root-portal': TransformReact2VueType
       'taro-root-portal-core': TransformReact2VueType
       'scroll-view': TransformReact2VueType<ScrollViewProps>
       'taro-scroll-view-core': TransformReact2VueType<ScrollViewProps>
       'share-element': TransformReact2VueType<ShareElementProps>
       'taro-share-element-core': TransformReact2VueType<ShareElementProps>
       swiper: TransformReact2VueType<SwiperProps>
       'taro-swiper-core': TransformReact2VueType<SwiperProps>
       'swiper-item': TransformReact2VueType<SwiperItemProps>
       'taro-swiper-item-core': TransformReact2VueType<SwiperItemProps>
       view: TransformReact2VueType<ViewProps>
       'taro-view-core': TransformReact2VueType<ViewProps>
       /** 基础内容 */
       icon: TransformReact2VueType<IconProps>
       'taro-icon-core': TransformReact2VueType<IconProps>
       progress: TransformReact2VueType<ProgressProps>
       'taro-progress-core': TransformReact2VueType<ProgressProps>
       'rich-text': TransformReact2VueType<RichTextProps>
       'taro-rich-text-core': TransformReact2VueType<RichTextProps>
       text: TransformReact2VueType<TextProps>
       'taro-text-core': TransformReact2VueType<TextProps>
       /** 表单组件 */
       button: TransformReact2VueType<ButtonProps>
       'taro-button-core': TransformReact2VueType<ButtonProps>
       checkbox: TransformReact2VueType<CheckboxProps>
       'taro-checkbox-core': TransformReact2VueType<CheckboxProps>
       'checkbox-group': TransformReact2VueType<CheckboxGroupProps>
       'taro-checkbox-group-core': TransformReact2VueType<CheckboxGroupProps>
       editor: TransformReact2VueType<EditorProps>
       'taro-editor-core': TransformReact2VueType<EditorProps>
       form: TransformReact2VueType<FormProps>
       'taro-form-core': TransformReact2VueType<FormProps>
       input: TransformReact2VueType<InputProps>
       'taro-input-core': TransformReact2VueType<InputProps>
       'keyboard-accessory': TransformReact2VueType<KeyboardAccessoryProps>
       'taro-keyboard-accessory-core': TransformReact2VueType<KeyboardAccessoryProps>
       label: TransformReact2VueType<LabelProps>
       'taro-label-core': TransformReact2VueType<LabelProps>
       picker: TransformReact2VueType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps>
       'taro-picker-core': TransformReact2VueType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps>
       'picker-view': TransformReact2VueType<PickerViewProps>
       'taro-picker-view-core': TransformReact2VueType<PickerViewProps>
       'picker-view-column': TransformReact2VueType
       'taro-picker-view-column-core': TransformReact2VueType
       radio: TransformReact2VueType<RadioProps>
       'taro-radio-core': TransformReact2VueType<RadioProps>
       'radio-group': TransformReact2VueType<RadioGroupProps>
       'taro-radio-group-core': TransformReact2VueType<RadioGroupProps>
       slider: TransformReact2VueType<SliderProps>
       'taro-slider-core': TransformReact2VueType<SliderProps>
       switch: TransformReact2VueType<SwitchProps>
       'taro-switch-core': TransformReact2VueType<SwitchProps>
       textarea: TransformReact2VueType<TextareaProps>
       'taro-textarea-core': TransformReact2VueType<TextareaProps>
       /** 导航 */
       'functional-page-navigator': TransformReact2VueType<FunctionalPageNavigatorProps>
       'taro-functional-page-navigator-core': TransformReact2VueType<FunctionalPageNavigatorProps>
       navigator: TransformReact2VueType<NavigatorProps>
       'taro-navigator-core': TransformReact2VueType<NavigatorProps>
       'navigation-bar': TransformReact2VueType<NavigationBarProps>
       'taro-navigation-bar-core': TransformReact2VueType<NavigationBarProps>
       /** 媒体组件 */
       audio: TransformReact2VueType<AudioProps>
       'taro-audio-core': TransformReact2VueType<AudioProps>
       camera: TransformReact2VueType<CameraProps>
       'taro-camera-core': TransformReact2VueType<CameraProps>
       image: TransformReact2VueType<ImageProps>
       'taro-image-core': TransformReact2VueType<ImageProps>
       'live-player': TransformReact2VueType<LivePlayerProps>
       'taro-live-player-core': TransformReact2VueType<LivePlayerProps>
       'live-pusher': TransformReact2VueType<LivePusherProps>
       'taro-live-pusher-core': TransformReact2VueType<LivePusherProps>
       video: TransformReact2VueType<VideoProps>
       'taro-video-core': TransformReact2VueType<VideoProps>
       'voip-room': TransformReact2VueType<VoipRoomProps>
       'taro-voip-room-core': TransformReact2VueType<VoipRoomProps>
       /** 地图 */
       map: TransformReact2VueType<MapProps>
       'taro-map-core': TransformReact2VueType<MapProps>
       /** 画布 */
       canvas: TransformReact2VueType<CanvasProps>
       'taro-canvas-core': TransformReact2VueType<CanvasProps>
       /** 开放能力 */
       ad: TransformReact2VueType<AdProps>
       'taro-ad-core': TransformReact2VueType<AdProps>
       'ad-custom': TransformReact2VueType<AdCustomProps>
       'taro-ad-custom-core': TransformReact2VueType<AdCustomProps>
       'official-account': TransformReact2VueType<OfficialAccountProps>
       'taro-official-account-core': TransformReact2VueType<OfficialAccountProps>
       'open-data': TransformReact2VueType<OpenDataProps>
       'taro-open-data-core': TransformReact2VueType<OpenDataProps>
       'web-view': TransformReact2VueType<WebViewProps>
       'taro-web-view-core': TransformReact2VueType<WebViewProps>
       /** 配置节点 */
       'page-meta': TransformReact2VueType<PageMetaProps>
       'taro-page-meta-core': TransformReact2VueType<PageMetaProps>

       'custom-wrapper': TransformReact2VueType<CustomWrapperProps>
       'taro-custom-wrapper-core': TransformReact2VueType<CustomWrapperProps>
       'slot': TransformReact2VueType<SlotProps>
       'taro-slot-core': TransformReact2VueType<SlotProps>
     }
   }
 }
