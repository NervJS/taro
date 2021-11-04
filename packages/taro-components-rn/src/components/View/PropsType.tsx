import * as React from 'react'
import { StyleProp, ViewStyle, ViewProps, View } from 'react-native'

export interface _ViewProps extends ViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onRef?: React.RefObject<View>;
}
