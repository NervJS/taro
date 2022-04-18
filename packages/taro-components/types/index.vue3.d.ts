/**
 * vue tsx @tarojs/components 类型提示文件
 * 如何使用?
 * 请在醒目全局的类型文件中写入以下代码，覆盖默认的组件类型提示
 * ```typescript
 *   declare module '@tarojs/components' {
 *     export * from '@tarojs/components/types/index.vue3'
 *   }
 * ```
 */
import { TaroElement } from '@tarojs/runtime'
import { StandardProps, StyleValue } from './common'
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

type ReserverdProps = {
  class?: any
  style?: StyleValue
  innerHTML?: string
}

/** 转换react的类型到vue */
type RemoveReactAttribute = keyof Omit<StandardProps, 'id' | 'hidden' | 'animation'>
export type TransformReact2VueType<P extends StandardProps = Record<string, never>> = DistributiveOmit<P, RemoveReactAttribute> & ReserverdProps

export declare class VueComponentType<P = Record<string, never>> extends TaroElement {
  $props: TransformReact2VueType<P>
  /** webstorm 提示貌似找的是props */
  props: this['$props']
}

/** 视图容器 */
declare class Block extends VueComponentType {}
declare class CoverImage extends VueComponentType<CoverImageProps> {}
declare class CoverView extends VueComponentType<CoverViewProps> {}
declare class MatchMedia extends VueComponentType<MatchMediaProps> {}
declare class MovableArea extends VueComponentType<MovableAreaProps> {}
declare class MovableView extends VueComponentType<MovableViewProps> {}
declare class PageContainer extends VueComponentType<PageContainerProps> {}
declare class ScrollView extends VueComponentType<ScrollViewProps> {}
declare class ShareElement extends VueComponentType<ShareElementProps> {}
declare class Swiper extends VueComponentType<SwiperProps> {}
declare class SwiperItem extends VueComponentType<SwiperItemProps> {}
declare class View extends VueComponentType<ViewProps> {}
/** 基础内容 */
declare class Icon extends VueComponentType<IconProps> {}
declare class Progress extends VueComponentType<ProgressProps> {}
declare class RichText extends VueComponentType<RichTextProps> {}
declare class Text extends VueComponentType<TextProps> {}
/** 表单组件 */
declare class Button extends VueComponentType<ButtonProps> {}
declare class Checkbox extends VueComponentType<CheckboxProps> {}
declare class CheckboxGroup extends VueComponentType<CheckboxGroupProps> {}
declare class Editor extends VueComponentType<EditorProps> {}
declare class Form extends VueComponentType<FormProps> {}
declare class Input extends VueComponentType<InputProps> {}
declare class KeyboardAccessory extends VueComponentType<KeyboardAccessoryProps> {}
declare class Label extends VueComponentType<LabelProps> {}
declare class Picker extends VueComponentType<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps> {}
declare class PickerView extends VueComponentType<PickerViewProps> {}
declare class PickerViewColumn extends VueComponentType {}
declare class Radio extends VueComponentType<RadioProps> {}
declare class RadioGroup extends VueComponentType<RadioGroupProps> {}
declare class Slider extends VueComponentType<SliderProps> {}
declare class Switch extends VueComponentType<SwitchProps> {}
declare class Textarea extends VueComponentType<TextareaProps> {}
/** 导航 */
declare class FunctionalPageNavigator extends VueComponentType<FunctionalPageNavigatorProps> {}
declare class Navigator extends VueComponentType<NavigatorProps> {}
declare class NavigationBar extends VueComponentType<NavigationBarProps> {}
/** 媒体组件 */
declare class Audio extends VueComponentType<AudioProps> {}
declare class Camera extends VueComponentType<CameraProps> {}
declare class Image extends VueComponentType<ImageProps> {}
declare class LivePlayer extends VueComponentType<LivePlayerProps> {}
declare class LivePusher extends VueComponentType<LivePusherProps> {}
declare class Video extends VueComponentType<VideoProps> {}
declare class VoipRoom extends VueComponentType<VoipRoomProps> {}
/** 地图 */
declare class Map extends VueComponentType<MapProps> {}
/** 画布 */
declare class Canvas extends VueComponentType<CanvasProps> {}
/** 开放能力 */
declare class Ad extends VueComponentType<AdProps> {}
declare class AdCustom extends VueComponentType<AdCustomProps> {}
declare class OfficialAccount extends VueComponentType<OfficialAccountProps> {}
declare class OpenData extends VueComponentType<OpenDataProps> {}
declare class WebView extends VueComponentType<WebViewProps> {}
/** 配置节点 */
declare class PageMeta extends VueComponentType<PageMetaProps> {}

declare class CustomWrapper extends VueComponentType<CustomWrapperProps> {}
declare class Slot extends VueComponentType<SlotProps> {}

export * from './index'

export {
  /** 视图容器 */
  Block,
  CoverImage,
  CoverView,
  MatchMedia,
  MovableArea,
  MovableView,
  PageContainer,
  ScrollView,
  ShareElement,
  Swiper,
  SwiperItem,
  View,
  /** 基础内容 */
  Icon,
  Progress,
  RichText,
  Text,
  /** 表单组件 */
  Button,
  Checkbox,
  CheckboxGroup,
  Editor,
  Form,
  Input,
  KeyboardAccessory,
  Label,
  Picker,
  PickerView,
  PickerViewColumn,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Textarea,
  /** 导航 */
  FunctionalPageNavigator,
  Navigator,
  NavigationBar,
  /** 媒体组件 */
  Audio,
  Camera,
  Image,
  LivePlayer,
  LivePusher,
  Video,
  VoipRoom,
  /** 地图 */
  Map,
  /** 画布 */
  Canvas,
  /** 开放能力 */
  Ad,
  AdCustom,
  OfficialAccount,
  OpenData,
  WebView,
  /** 配置节点 */
  PageMeta,
  CustomWrapper,
  Slot
}
