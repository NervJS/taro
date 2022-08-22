import * as React from 'react'
import { StyleProp, ViewStyle, ViewProps } from 'react-native'

export interface _ViewProps extends ViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}
