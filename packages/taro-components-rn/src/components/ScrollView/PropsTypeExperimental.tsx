import * as React from 'react'
import { StyleProp, ViewStyle, ListRenderItem } from 'react-native'
import { LoadingFooter } from 'react-native-spring-scrollview'

export type ScrollMetrics = {
  contentLength: number;
    dOffset: number;
    dt: number;
    offset: number;
    offsetX: number;
    offsetY: number;
    timestamp: number;
    velocity: number;
    visibleLength: number;
}

export type EventOnScrollToUpper = {
  distanceFromTop: number;
}

export type EventOnScrollToLower = {
  distanceFromEnd: number;
}

export type EventOnScroll = {
  detail: {
    scrollLeft: number;
    scrollTop: number;
    scrollHeight: number;
    scrollWidth: number;
    deltaX: number;
    deltaY: number;
  }
}

export interface ScrollViewState {
  snapScrollTop: number;
  snapScrollLeft: number;
}

export interface ScrollViewProps<ItemT> {
  style?: StyleProp<ViewStyle>;
  data: any[];
  heightForItem: (item:any,index:number) => number;
  renderHeader?: () => React.ReactElement;
  renderFooter?: () => React.ReactElement;
  renderItem: (item:any, index:number) => React.ReactElement

  scrollX?: boolean;
  upperThreshold: number;
  lowerThreshold: number;
  scrollTop: number;
  scrollLeft: number;
  onScrollToUpper?: (evt: EventOnScrollToUpper) => void;
  onScrollToLower?: (evt: EventOnScrollToLower) => void;
  onScroll?: (evt: EventOnScroll) => void;
  // RN 属性
  contentContainerStyle?: StyleProp<ViewStyle>;
}
