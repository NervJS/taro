import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export type EventOnChange = {
  detail: {
    current: number
  }
}

export type EventOnAnimationFinish = {
  detail: {
    current: number
  }
}

export interface SwiperItemProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
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
