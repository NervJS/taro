import * as React from 'react'
import { StyleProp, ViewProps, ViewStyle } from 'react-native'

export interface _ViewProps extends ViewProps {
  className?: string
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}
