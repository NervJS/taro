import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export interface ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}
