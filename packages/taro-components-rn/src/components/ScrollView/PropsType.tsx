/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
