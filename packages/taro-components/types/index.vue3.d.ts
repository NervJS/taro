/**
 * vue tsx @tarojs/components 类型提示文件
 * 如何使用?
 * 请在醒目全局的类型文件中写入以下代码，覆盖默认的组件类型提示
 * ```typescript
 *   export declare module '@tarojs/components' {
 *     export * from '@tarojs/components/types/index.vue3'
 *   }
 * ```
 */
import { TaroElement } from '@tarojs/runtime'
import { StandardProps } from './common'
import * as CSS from 'csstype'
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

// 联合类型不能用omit（比如picker）
type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

type SlimProps = {
  class?: any
  style?: CSS.Properties<string | number>
  innerHTML?: string
}

/** 转换react的类型到vue */
type RemoveReactAttribute = 'className' | 'style' | 'key' | 'ref' | 'dangerouslySetInnerHTML'
export type TransformReact2VueType<P extends StandardProps = Record<string, never>> = DistributiveOmit<P, RemoveReactAttribute> & SlimProps

export declare class VueComponentType<P = Record<string, never>> extends TaroElement {
  $props: TransformReact2VueType<P>
  /** WebStorm 提示貌似找的是props */
  props: this['$props']
}

/** 视图容器 */
export declare class Block extends VueComponentType {}
export declare class CoverImage extends VueComponentType<CoverImageProps> {}
export declare class CoverView extends VueComponentType<CoverViewProps> {}
export declare class MatchMedia extends VueComponentType<MatchMediaProps> {}
export declare class MovableArea extends VueComponentType<MovableAreaProps> {}
export declare class MovableView extends VueComponentType<MovableViewProps> {}
export declare class PageContainer extends VueComponentType<PageContainerProps> {}
export declare class ScrollView extends VueComponentType<ScrollViewProps> {}
export declare class ShareElement extends VueComponentType<ShareElementProps> {}
export declare class Swiper extends VueComponentType<SwiperProps> {}
export declare class SwiperItem extends VueComponentType<SwiperItemProps> {}
export declare class View extends VueComponentType<ViewProps> {}
/** 基础内容 */
export declare class Icon extends VueComponentType<IconProps> {}
export declare class Progress extends VueComponentType<ProgressProps> {}
export declare class RichText extends VueComponentType<RichTextProps> {}
export declare class Text extends VueComponentType<TextProps> {}
/** 表单组件 */
export declare class Button extends VueComponentType<ButtonProps> {}
export declare class Checkbox extends VueComponentType<CheckboxProps> {}
export declare class CheckboxGroup extends VueComponentType<CheckboxGroupProps> {}
export declare class Editor extends VueComponentType<EditorProps> {}
export declare class Form extends VueComponentType<FormProps> {}
export declare class Input extends VueComponentType<InputProps> {}
export declare class KeyboardAccessory extends VueComponentType<KeyboardAccessoryProps> {}
export declare class Label extends VueComponentType<LabelProps> {}
export declare class Picker extends VueComponentType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps> {}
export declare class PickerView extends VueComponentType<PickerViewProps> {}
export declare class PickerViewColumn extends VueComponentType {}
export declare class Radio extends VueComponentType<RadioProps> {}
export declare class RadioGroup extends VueComponentType<RadioGroupProps> {}
export declare class Slider extends VueComponentType<SliderProps> {}
export declare class Switch extends VueComponentType<SwitchProps> {}
export declare class Textarea extends VueComponentType<TextareaProps> {}
/** 导航 */
export declare class FunctionalPageNavigator extends VueComponentType<FunctionalPageNavigatorProps> {}
export declare class Navigator extends VueComponentType<NavigatorProps> {}
export declare class NavigationBar extends VueComponentType<NavigationBarProps> {}
/** 媒体组件 */
export declare class Audio extends VueComponentType<AudioProps> {}
export declare class Camera extends VueComponentType<CameraProps> {}
export declare class Image extends VueComponentType<ImageProps> {}
export declare class LivePlayer extends VueComponentType<LivePlayerProps> {}
export declare class LivePusher extends VueComponentType<LivePusherProps> {}
export declare class Video extends VueComponentType<VideoProps> {}
export declare class VoipRoom extends VueComponentType<VoipRoomProps> {}
/** 地图 */
export declare class Map extends VueComponentType<MapProps> {}
/** 画布 */
export declare class Canvas extends VueComponentType<CanvasProps> {}
/** 开放能力 */
export declare class Ad extends VueComponentType<AdProps> {}
export declare class AdCustom extends VueComponentType<AdCustomProps> {}
export declare class OfficialAccount extends VueComponentType<OfficialAccountProps> {}
export declare class OpenData extends VueComponentType<OpenDataProps> {}
export declare class WebView extends VueComponentType<WebViewProps> {}
/** 配置节点 */
export declare class PageMeta extends VueComponentType<PageMetaProps> {}

export declare class CustomWrapper extends VueComponentType<CustomWrapperProps> {}
export declare class Slot extends VueComponentType<SlotProps> {}

export * from './index'
