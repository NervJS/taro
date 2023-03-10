/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
