import * as React from 'react'
import { StyleProp, ViewStyle, ListRenderItem } from 'react-native'

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
  };
}

export interface ScrollViewState {
  snapScrollTop: number;
  snapScrollLeft: number;
}

export interface ScrollViewProps<ItemT> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollX?: boolean;
  upperThreshold: number;
  lowerThreshold: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollWithAnimation?: boolean;
  enableBackToTop: boolean;
  onScrollToUpper?: (evt: EventOnScrollToUpper) => void;
  onScrollToLower?: (evt: EventOnScrollToLower) => void;
  onScroll?: (evt: EventOnScroll) => void;
  // RN 属性
  contentContainerStyle?: StyleProp<ViewStyle>;
  data?: ReadonlyArray<ItemT> | null;
  renderItem?: ListRenderItem<ItemT>;
}
