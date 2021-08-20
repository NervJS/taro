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
import { StyleProp, ViewStyle } from 'react-native'

export type EventOnChange = {
  detail: {
    current: number;
  };
}

export type EventOnAnimationFinish = {
  detail: {
    current: number;
  };
}

export interface SwiperProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  indicatorDots?: boolean;
  indicatorColor: string;
  indicatorActiveColor: string;
  autoplay?: boolean;
  current: number;
  interval: number;
  circular?: boolean;
  vertical?: boolean;
  onChange?: (evt: EventOnChange) => void;
  onAnimationFinish?: (evt: EventOnAnimationFinish) => void;
}

export interface PaginationProps {
  vertical?: boolean;
  current: number;
  count: number;
  styles: any;
  dotStyle?: StyleProp<ViewStyle>;
  dotActiveStyle?: StyleProp<ViewStyle>;
}

export interface CarouselProps {
  selectedIndex?: number;
  dots?: boolean;
  vertical?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  infinite?: boolean;
  style?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  dotActiveStyle?: StyleProp<ViewStyle>;
  pagination?: (props: PaginationProps) => React.ReactNode;
  afterChange?: (index: number) => void;
}
