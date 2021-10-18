import { StyleProp, ViewStyle, Animated } from 'react-native'
import { ProgressProps as _ProgressProps } from '@tarojs/components/types/Progress'
export interface ProgressState {
  percent: number;
  prevPercent: number;
  valve: Animated.Value;
}

export interface ProgressProps extends _ProgressProps {
  style: StyleProp<ViewStyle> | any;
  percent: number;
}
