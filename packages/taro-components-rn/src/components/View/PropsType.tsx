import * as React from 'react'
import { StyleProp, ViewStyle, ViewProps } from 'react-native'

export interface _ViewProps extends ViewProps {
  _ref?: React.Ref<any>
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}
