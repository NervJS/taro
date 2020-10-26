import { StyleProp, ViewStyle, Animated } from 'react-native'

export interface ProgressState {
  percent: number;
  prevPercent: number;
  valve: Animated.Value;
}

export interface ProgressProps {
  style?: StyleProp<ViewStyle>;
  percent: number;
  showInfo?: boolean;
  strokeWidth: number;
  activeColor: string;
  backgroundColor: string;
  active?: boolean;
  activeMode: 'backwards' | 'forwards';
}
