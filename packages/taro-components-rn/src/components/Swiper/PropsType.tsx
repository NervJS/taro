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
