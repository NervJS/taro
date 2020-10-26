import * as React from 'react'
import { ViewStyle, StyleProp } from 'react-native'

export interface IconProps {
  style?: StyleProp<ViewStyle>;
  type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'waiting' | 'cancel' | 'download' | 'search' | 'clear';
  size?: number | string;
  color?: string;
}
