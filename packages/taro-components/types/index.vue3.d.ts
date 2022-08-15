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
import { Component } from 'vue'

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
export type VueComponentType<P = Record<string, never>> = Component<TransformReact2VueType<P>>

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
