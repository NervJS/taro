import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export interface TextProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  selectable?: boolean;
  onClick?: () => void;
}
