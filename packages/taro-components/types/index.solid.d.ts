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
import { JSXElement } from 'solid-js';

import { AdProps } from './Ad'
import { AdCustomProps } from './AdCustom'
import { AudioProps } from './Audio'
import { ButtonProps } from './Button'
import { CameraProps } from './Camera'
import { ChannelLiveProps } from './ChannelLive'
import { ChannelVideoProps } from './ChannelVideo'
import { CanvasProps } from './Canvas'
import { CheckboxProps } from './Checkbox'
import { CheckboxGroupProps } from './CheckboxGroup'
import { StandardProps } from './common'
import { CoverImageProps } from './CoverImage'
import { CoverViewProps } from './CoverView'
import { CustomWrapperProps } from './CustomWrapper'
import { EditorProps } from './Editor'
import { FormProps } from './Form'
import { FunctionalPageNavigatorProps } from './FunctionalPageNavigator'
import { IconProps } from './Icon'
import { ImageProps } from './Image'
import { InputProps } from './Input'
import { KeyboardAccessoryProps } from './KeyboardAccessory'
import { LabelProps } from './Label'
import { LivePlayerProps } from './LivePlayer'
import { LivePusherProps } from './LivePusher'
import { MapProps } from './Map'
import { MatchMediaProps } from './MatchMedia'
import { MovableAreaProps } from './MovableArea'
import { MovableViewProps } from './MovableView'
import { NavigationBarProps } from './NavigationBar'
import { NavigatorProps } from './Navigator'
import { OfficialAccountProps } from './OfficialAccount'
import { OpenDataProps } from './OpenData'
import { PageContainerProps } from './PageContainer'
import { PageMetaProps } from './PageMeta'
import {
  PickerDateProps, PickerMultiSelectorProps,
  PickerRegionProps, PickerSelectorProps, PickerTimeProps
} from './Picker'
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
import { RootPortalProps } from './RootPortal'
import { PickerViewColumnProps } from './PickerViewColumn'
import { NativeSlotProps } from './NativeSlot'
import { GridViewProps } from './GridView'
import { ListViewProps } from './ListView'
import { StickyHeaderProps } from './StickyHeader'
import { StickySectionProps } from './StickySection'

/** 转换 react 的类型到 solid */
type Props<T> =
& Omit<T, 'ref' | 'className' | 'children'>
& {
    /** class 名 */
    class?: string;
    /** 子元素 */
    children?: JSXElement;
    classList?: { [key: string]: boolean };
    ref?: JSXElement | ((node: JSXElement) => void);
  };
type Components<T> = (props: Props<T>) => JSXElement;

export * from './common'
export * from './event'
export * from './props'

/** 视图容器 */
export declare const Block: Components<StandardProps>
export declare const CoverImage: Components<CoverImageProps>
export declare const CoverView: Components<CoverViewProps>
export declare const GridView: Components<GridViewProps>
export declare const ListView: Components<ListViewProps>
export declare const MatchMedia: Components<MatchMediaProps>
export declare const MovableArea: Components<MovableAreaProps>
export declare const MovableView: Components<MovableViewProps>
export declare const PageContainer: Components<PageContainerProps>
export declare const RootPortal: Components<RootPortalProps>
export declare const ScrollView: Components<ScrollViewProps>
export declare const ShareElement: Components<ShareElementProps>
export declare const StickyHeader: Components<StickyHeaderProps>
export declare const StickySection: Components<StickySectionProps>
export declare const Swiper: Components<SwiperProps>
export declare const SwiperItem: Components<SwiperItemProps>
export declare const View: Components<ViewProps>
/** 基础内容 */
export declare const Icon: Components<IconProps>
export declare const Progress: Components<ProgressProps>
export declare const RichText: Components<RichTextProps>
export declare const Text: Components<TextProps>
/** 表单组件 */
export declare const Button: Components<ButtonProps>
export declare const Checkbox: Components<CheckboxProps>
export declare const CheckboxGroup: Components<CheckboxGroupProps>
export declare const Editor: Components<EditorProps>
export declare const Form: Components<FormProps>
export declare const Input: Components<InputProps>
export declare const KeyboardAccessory: Components<KeyboardAccessoryProps>
export declare const Label: Components<LabelProps>
export declare const Picker: Components<PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps | PickerSelectorProps>
export declare const PickerView: Components<PickerViewProps>
export declare const PickerViewColumn: Components<PickerViewColumnProps>
export declare const Radio: Components<RadioProps>
export declare const RadioGroup: Components<RadioGroupProps>
export declare const Slider: Components<SliderProps>
export declare const Switch: Components<SwitchProps>
export declare const Textarea: Components<TextareaProps>
/** 导航 */
export declare const FunctionalPageNavigator: Components<FunctionalPageNavigatorProps>
export declare const Navigator: Components<NavigatorProps>
export declare const NavigationBar: Components<NavigationBarProps>
/** 媒体组件 */
export declare const Audio: Components<AudioProps>
export declare const Camera: Components<CameraProps>
export declare const ChannelLive: Components<ChannelLiveProps>
export declare const ChannelVideo: Components<ChannelVideoProps>
export declare const Image: Components<ImageProps>
export declare const LivePlayer: Components<LivePlayerProps>
export declare const LivePusher: Components<LivePusherProps>
export declare const Video: Components<VideoProps>
export declare const VoipRoom: Components<VoipRoomProps>
/** 地图 */
export declare const Map: Components<MapProps>
/** 画布 */
export declare const Canvas: Components<CanvasProps>
/** 开放能力 */
export declare const Ad: Components<AdProps>
export declare const AdCustom: Components<AdCustomProps>
export declare const OfficialAccount: Components<OfficialAccountProps>
export declare const OpenData: Components<OpenDataProps>
export declare const WebView: Components<WebViewProps>
/** 配置节点 */
export declare const PageMeta: Components<PageMetaProps>

export declare const CustomWrapper: Components<CustomWrapperProps>
export declare const Slot: Components<SlotProps>
export declare const NativeSlot: Components<NativeSlotProps>
