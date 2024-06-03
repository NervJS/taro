import { ProgressProps as _ProgressProps } from '@tarojs/components/types/Progress'
import { Animated, StyleProp, ViewStyle } from 'react-native'

export interface ProgressState {
  percent: number
  prevPercent: number
  valve: Animated.Value
}

export interface ProgressProps extends _ProgressProps {
  style: StyleProp<ViewStyle> | any
  percent: number
}
