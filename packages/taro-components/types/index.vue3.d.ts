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
import { DefineComponent, VNodeRef } from 'vue'

/** 开放能力 */
import { AdProps } from './Ad'
import { AdCustomProps } from './AdCustom'
/** 媒体组件 */
import { AudioProps } from './Audio'
/** 表单组件 */
import { ButtonProps } from './Button'
import { CameraProps } from './Camera'
/** 画布 */
import { CanvasProps } from './Canvas'
import { CheckboxProps } from './Checkbox'
import { CheckboxGroupProps } from './CheckboxGroup'
import { StandardProps } from './common'
/** 视图容器 */
import { CoverImageProps } from './CoverImage'
import { CoverViewProps } from './CoverView'
import { CustomWrapperProps } from './CustomWrapper'
import { EditorProps } from './Editor'
import { FormProps } from './Form'
/** 导航 */
import { FunctionalPageNavigatorProps } from './FunctionalPageNavigator'
/** 基础内容 */
import { IconProps } from './Icon'
import { ImageProps } from './Image'
import { InputProps } from './Input'
import { KeyboardAccessoryProps } from './KeyboardAccessory'
import { LabelProps } from './Label'
import { LivePlayerProps } from './LivePlayer'
import { LivePusherProps } from './LivePusher'
/** 地图 */
import { MapProps } from './Map'
import { MatchMediaProps } from './MatchMedia'
import { MovableAreaProps } from './MovableArea'
import { MovableViewProps } from './MovableView'
import { NavigationBarProps } from './NavigationBar'
import { NavigatorProps } from './Navigator'
import { OfficialAccountProps } from './OfficialAccount'
import { OpenDataProps } from './OpenData'
import { PageContainerProps } from './PageContainer'
/** 配置节点 */
import { PageMetaProps } from './PageMeta'
import { PickerDateProps, PickerMultiSelectorProps,PickerRegionProps, PickerSelectorProps, PickerTimeProps } from './Picker'
import { PickerViewProps } from './PickerView'
import { ProgressProps } from './Progress'
import { RadioProps } from './Radio'
import { RadioGroupProps } from './RadioGroup'
import { RichTextProps } from './RichText'
import { ScrollViewProps } from './ScrollView'
import { ShareElementProps } from './ShareElement'
import { SliderProps } from './Slider'
import { SlotProps } from './Slot'
import { SwiperProps } from './Swiper'
import { SwiperItemProps } from './SwiperItem'
import { SwitchProps } from './Switch'
import { TextProps } from './Text'
import { TextareaProps } from './Textarea'
import { VideoProps } from './Video'
import { ViewProps } from './View'
import { VoipRoomProps } from './VoipRoom'
import { WebViewProps } from './WebView'

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

type ReservedProps = {
  key?: string | number | symbol
  ref?: VNodeRef
  ref_for?: boolean
  ref_key?: string
}

type ElementAttrs<T> = T & ReservedProps

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /** 视图容器 */
      block: ElementAttrs<TransformReact2VueType<StandardProps>>
      'taro-block-core': ElementAttrs<TransformReact2VueType<StandardProps>>
      'cover-image': ElementAttrs<TransformReact2VueType<CoverImageProps>>
      'taro-cover-image-core': ElementAttrs<TransformReact2VueType<CoverImageProps>>
      'cover-view': ElementAttrs<TransformReact2VueType<CoverViewProps>>
      'taro-cover-view-core': ElementAttrs<TransformReact2VueType<CoverViewProps>>
      'match-media': ElementAttrs<TransformReact2VueType<MatchMediaProps>>
      'taro-match-media-core': ElementAttrs<TransformReact2VueType<MatchMediaProps>>
      'movable-area': ElementAttrs<TransformReact2VueType<MovableAreaProps>>
      'taro-movable-area-core': ElementAttrs<TransformReact2VueType<MovableAreaProps>>
      'movable-view': ElementAttrs<TransformReact2VueType<MovableViewProps>>
      'taro-movable-view-core': ElementAttrs<TransformReact2VueType<MovableViewProps>>
      'page-container': ElementAttrs<TransformReact2VueType<PageContainerProps>>
      'taro-page-container-core': ElementAttrs<TransformReact2VueType<PageContainerProps>>
      'root-portal': ElementAttrs<TransformReact2VueType>
      'taro-root-portal-core': ElementAttrs<TransformReact2VueType>
      'scroll-view': ElementAttrs<TransformReact2VueType<ScrollViewProps>>
      'taro-scroll-view-core': ElementAttrs<TransformReact2VueType<ScrollViewProps>>
      'share-element': ElementAttrs<TransformReact2VueType<ShareElementProps>>
      'taro-share-element-core': ElementAttrs<TransformReact2VueType<ShareElementProps>>
      swiper: ElementAttrs<TransformReact2VueType<SwiperProps>>
      'taro-swiper-core': ElementAttrs<TransformReact2VueType<SwiperProps>>
      'swiper-item': ElementAttrs<TransformReact2VueType<SwiperItemProps>>
      'taro-swiper-item-core': ElementAttrs<TransformReact2VueType<SwiperItemProps>>
      view: ElementAttrs<TransformReact2VueType<ViewProps>>
      'taro-view-core': ElementAttrs<TransformReact2VueType<ViewProps>>
      /** 基础内容 */
      icon: ElementAttrs<TransformReact2VueType<IconProps>>
      'taro-icon-core': ElementAttrs<TransformReact2VueType<IconProps>>
      progress: ElementAttrs<TransformReact2VueType<ProgressProps>>
      'taro-progress-core': ElementAttrs<TransformReact2VueType<ProgressProps>>
      'rich-text': ElementAttrs<TransformReact2VueType<RichTextProps>>
      'taro-rich-text-core': ElementAttrs<TransformReact2VueType<RichTextProps>>
      text: ElementAttrs<TransformReact2VueType<TextProps>>
      'taro-text-core': ElementAttrs<TransformReact2VueType<TextProps>>
      /** 表单组件 */
      button: ElementAttrs<TransformReact2VueType<ButtonProps>>
      'taro-button-core': ElementAttrs<TransformReact2VueType<ButtonProps>>
      checkbox: ElementAttrs<TransformReact2VueType<CheckboxProps>>
      'taro-checkbox-core': ElementAttrs<TransformReact2VueType<CheckboxProps>>
      'checkbox-group': ElementAttrs<TransformReact2VueType<CheckboxGroupProps>>
      'taro-checkbox-group-core': ElementAttrs<TransformReact2VueType<CheckboxGroupProps>>
      editor: ElementAttrs<TransformReact2VueType<EditorProps>>
      'taro-editor-core': ElementAttrs<TransformReact2VueType<EditorProps>>
      form: ElementAttrs<TransformReact2VueType<FormProps>>
      'taro-form-core': ElementAttrs<TransformReact2VueType<FormProps>>
      input: ElementAttrs<TransformReact2VueType<InputProps>>
      'taro-input-core': ElementAttrs<TransformReact2VueType<InputProps>>
      'keyboard-accessory': ElementAttrs<TransformReact2VueType<KeyboardAccessoryProps>>
      'taro-keyboard-accessory-core': ElementAttrs<TransformReact2VueType<KeyboardAccessoryProps>>
      label: ElementAttrs<TransformReact2VueType<LabelProps>>
      'taro-label-core': ElementAttrs<TransformReact2VueType<LabelProps>>
      picker: ElementAttrs<TransformReact2VueType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps>>
      'taro-picker-core': ElementAttrs<TransformReact2VueType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps>>
      'picker-view': ElementAttrs<TransformReact2VueType<PickerViewProps>>
      'taro-picker-view-core': ElementAttrs<TransformReact2VueType<PickerViewProps>>
      'picker-view-column': ElementAttrs<TransformReact2VueType>
      'taro-picker-view-column-core': ElementAttrs<TransformReact2VueType>
      radio: ElementAttrs<TransformReact2VueType<RadioProps>>
      'taro-radio-core': ElementAttrs<TransformReact2VueType<RadioProps>>
      'radio-group': ElementAttrs<TransformReact2VueType<RadioGroupProps>>
      'taro-radio-group-core': ElementAttrs<TransformReact2VueType<RadioGroupProps>>
      slider: ElementAttrs<TransformReact2VueType<SliderProps>>
      'taro-slider-core': ElementAttrs<TransformReact2VueType<SliderProps>>
      switch: ElementAttrs<TransformReact2VueType<SwitchProps>>
      'taro-switch-core': ElementAttrs<TransformReact2VueType<SwitchProps>>
      textarea: ElementAttrs<TransformReact2VueType<TextareaProps>>
      'taro-textarea-core': ElementAttrs<TransformReact2VueType<TextareaProps>>
      /** 导航 */
      'functional-page-navigator': ElementAttrs<TransformReact2VueType<FunctionalPageNavigatorProps>>
      'taro-functional-page-navigator-core': ElementAttrs<TransformReact2VueType<FunctionalPageNavigatorProps>>
      navigator: ElementAttrs<TransformReact2VueType<NavigatorProps>>
      'taro-navigator-core': ElementAttrs<TransformReact2VueType<NavigatorProps>>
      'navigation-bar': ElementAttrs<TransformReact2VueType<NavigationBarProps>>
      'taro-navigation-bar-core': ElementAttrs<TransformReact2VueType<NavigationBarProps>>
      /** 媒体组件 */
      audio: ElementAttrs<TransformReact2VueType<AudioProps>>
      'taro-audio-core': ElementAttrs<TransformReact2VueType<AudioProps>>
      camera: ElementAttrs<TransformReact2VueType<CameraProps>>
      'taro-camera-core': ElementAttrs<TransformReact2VueType<CameraProps>>
      image: ElementAttrs<TransformReact2VueType<ImageProps>>
      'taro-image-core': ElementAttrs<TransformReact2VueType<ImageProps>>
      'live-player': ElementAttrs<TransformReact2VueType<LivePlayerProps>>
      'taro-live-player-core': ElementAttrs<TransformReact2VueType<LivePlayerProps>>
      'live-pusher': ElementAttrs<TransformReact2VueType<LivePusherProps>>
      'taro-live-pusher-core': ElementAttrs<TransformReact2VueType<LivePusherProps>>
      video: ElementAttrs<TransformReact2VueType<VideoProps>>
      'taro-video-core': ElementAttrs<TransformReact2VueType<VideoProps>>
      'voip-room': ElementAttrs<TransformReact2VueType<VoipRoomProps>>
      'taro-voip-room-core': ElementAttrs<TransformReact2VueType<VoipRoomProps>>
      /** 地图 */
      map: ElementAttrs<TransformReact2VueType<MapProps>>
      'taro-map-core': ElementAttrs<TransformReact2VueType<MapProps>>
      /** 画布 */
      canvas: ElementAttrs<TransformReact2VueType<CanvasProps>>
      'taro-canvas-core': ElementAttrs<TransformReact2VueType<CanvasProps>>
      /** 开放能力 */
      ad: ElementAttrs<TransformReact2VueType<AdProps>>
      'taro-ad-core': ElementAttrs<TransformReact2VueType<AdProps>>
      'ad-custom': ElementAttrs<TransformReact2VueType<AdCustomProps>>
      'taro-ad-custom-core': ElementAttrs<TransformReact2VueType<AdCustomProps>>
      'official-account': ElementAttrs<TransformReact2VueType<OfficialAccountProps>>
      'taro-official-account-core': ElementAttrs<TransformReact2VueType<OfficialAccountProps>>
      'open-data': ElementAttrs<TransformReact2VueType<OpenDataProps>>
      'taro-open-data-core': ElementAttrs<TransformReact2VueType<OpenDataProps>>
      'web-view': ElementAttrs<TransformReact2VueType<WebViewProps>>
      'taro-web-view-core': ElementAttrs<TransformReact2VueType<WebViewProps>>
      /** 配置节点 */
      'page-meta': ElementAttrs<TransformReact2VueType<PageMetaProps>>
      'taro-page-meta-core': ElementAttrs<TransformReact2VueType<PageMetaProps>>

      'custom-wrapper': ElementAttrs<TransformReact2VueType<CustomWrapperProps>>
      'taro-custom-wrapper-core': ElementAttrs<TransformReact2VueType<CustomWrapperProps>>
      'slot': ElementAttrs<TransformReact2VueType<SlotProps>>
      'taro-slot-core': ElementAttrs<TransformReact2VueType<SlotProps>>
    }
  }
}
